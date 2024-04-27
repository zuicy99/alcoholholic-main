import { Button, Checkbox, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { LoginBt, LoginTitle, LoginWrap } from "../../styles/login/loginCss";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Common } from "../../styles/CommonCss";
import styled from "@emotion/styled/macro";

import { areaStyle, buttonPrimaryStyle } from "../../styles/sign/signArea";
import { P20, SignWrap } from "../../styles/basic";
import { useNavigate } from "react-router";
import axios from "axios";
import Address from "../../components/singup/Address";
import { postSign } from "../../api/signUpApi";

const initState = {
  email: "",
  nickname: "",
  password: "",
  passwordch: "",
  address: "",
  lastaddress: "",
  gender: "",
  birthdate: "",
  phone: "",
};
const SignupPage = () => {
  const navigate = useNavigate();
  const [memberInfo, setMemberInfo] = useState(initState);

  const [address, setAddress] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");

  const handleClickSearch = e => {
    e.preventDefault();

    // Form 데이터를 수집하여 확인
    const formData = {
      email: memberInfo.email,
      password: memberInfo.password,
      passwordch: memberInfo.password,
      birthdate: memberInfo.birthdate,
      nicname: memberInfo.nicname,
      phone: memberInfo.phone,
      gender: memberInfo.gender,
      address: memberInfo.address,
      lastaddress: memberInfo.address,
    };
    console.log("현재 입력된 값:", formData);
  };

  const [lastaddress, setlastaddress] = useState("");

  const updateAddressInfo = ({ address }) => {
    setAddress(address);
  };

  const onFinish = values => {
    console.log("현재 입력된 값:", values);
    postSign({ address, values, successFn, failFn, errorFn });
    // navigate("/login");
  };

  const handleGenderChange = value => {
    setGender(value); // 성별 상태 업데이트
  };

  const fetchData = () => {
    postSign({
      successFn,
      failFn,
      errorFn,
    });
  };
  const successFn = data => {
    // console.log("successFn : ", data);
    setMemberInfo(data);
    fetchData();
  };

  const failFn = data => {
    // console.log("failFn : ", data);
    alert("failFn : 데이터 호출에 실패하였습니다.");
  };

  const errorFn = data => {
    // console.log("errorFn : ", data);
    alert("서버상태 불안정 그래서, 데모테스트했음.");
    setMemberInfo(data);
  };

  return (
    <div>
      <LoginWrap>
        <LoginTitle>
          <p className="logo">회원가입</p>
        </LoginTitle>
        <div style={{ marginBottom: "20px" }}>
          <P20 style={{ color: `${Common.color.f900}` }}>
            만 20세 미만은 회원가입이 불가합니다.
          </P20>
          <P20>아래 정보를 입력하시면 회원가입이 완료됩니다.</P20>
        </div>

        <SignWrap>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
              email: memberInfo.email,
              password: memberInfo.password,
              passwordch: memberInfo.password,
              birthdate: memberInfo.birthdate,
              nickname: memberInfo.nickname,
              phone: memberInfo.phone,
              gender: memberInfo.gender,
              address: memberInfo.address,
              lastaddress: memberInfo.lastaddress,
            }}
            onFinish={onFinish}
          >
            <div style={{ marginBottom: "80px" }}>
              <P20 style={{ fontWeight: "bold", marginBottom: "20px" }}>
                본인인증정보
              </P20>
              <Form.Item
                name="nickname"
                rules={[
                  {
                    required: true,
                    message: "닉네임을 입력하세요.",
                  },
                  {
                    pattern: /^[가-힣]{2,10}$/,
                    message: "한글로 2~10자 사이의 이름을 입력하세요.",
                  },
                  {
                    whitespace: true,
                    message: "이름은 공백만으로 만들 수 없습니다",
                  },
                ]}
              >
                <Input
                  style={areaStyle}
                  placeholder="닉네임"
                  onChange={e => setNickname(e.target.value)}
                />
              </Form.Item>
              <div style={{ display: "flex" }}>
                <Form.Item
                  name="birthdate"
                  rules={[
                    {
                      required: true,
                      message: "생년월일을 입력하세요.",
                    },
                    {
                      pattern: /^[0-9]{6}$/,
                      message: "숫자로 6자로 입력해주세요.",
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: "숫자만 입력하세요.",
                    },
                    {
                      whitespace: true,
                      message: "공백만으로 만들 수 없습니다",
                    },
                    {
                      validator: (_, value) => {
                        // 주민등록번호 문자열을 날짜로 변환
                        const year = value.substr(0, 2);
                        const month = value.substr(2, 2);
                        const day = value.substr(4, 2);
                        // 현재 날짜 구하기
                        const currentDate = new Date();
                        // 생년월일 계산
                        const birthYear =
                          parseInt(year) < 22
                            ? 2000 + parseInt(year)
                            : 1900 + parseInt(year);
                        const birthDate = new Date(
                          birthYear,
                          parseInt(month) - 1,
                          parseInt(day),
                        );
                        // 나이 계산
                        const age =
                          currentDate.getFullYear() - birthDate.getFullYear();
                        // 생일이 지났는지 체크
                        if (
                          currentDate.getMonth() < birthDate.getMonth() ||
                          (currentDate.getMonth() === birthDate.getMonth() &&
                            currentDate.getDate() < birthDate.getDate())
                        )
                          if (age < 20) {
                            // 20세 미만인 경우 에러 반환
                            return Promise.reject(
                              "20세 미만은 가입할 수 없습니다.",
                            );
                          }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    style={{ width: 520, height: 60, fontSize: "20px" }}
                    placeholder="생년월일(8자리)"
                    onChange={e => setBirthdate(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Select
                    style={{
                      width: "110px",
                      height: "60px",
                      backgroundColor: `${Common.color.p300}`,
                      marginLeft: "8px",
                      color: `${Common.color.p600}`,
                      fontSize: "20px",
                      borderRadius: "20px",
                    }}
                    placeholder="성별"
                    onChange={handleGenderChange}
                  >
                    <Select.Option value="FEMAIL">여성</Select.Option>
                    <Select.Option value="MALE">남성</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div style={{ display: "flex" }}>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "전화번호를 입력 해주세요",
                    },
                    {
                      required: true,
                      message: "전화번호를 입력 해주세요",
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: "숫자만 입력하세요.",
                    },
                    {
                      whitespace: true,
                      message: "전화번호는 공백만으로 만들 수 없습니다",
                    },
                  ]}
                >
                  <Input
                    // defaultValue="010"
                    style={{ width: 520, height: 60, fontSize: "20px" }}
                    placeholder="전화번호"
                    onChange={e => setPhone(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            {/* 아래 필수정보 이메일, 비밀번호, 주소 */}
            <div>
              <P20 style={{ fontWeight: "bold", marginBottom: "20px" }}>
                필수정보
              </P20>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "올바른 이메일 형식을 입력하세요.",
                  },
                  {
                    required: true,
                    message: "이메일을 입력하세요.",
                  },
                  {
                    pattern:
                      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i,
                    message: "이메일 형식에 맞게 작성해주세요",
                  },
                  {
                    whitespace: true,
                    message: "이메일은 공백만으로 만들 수 없습니다",
                  },
                ]}
              >
                <Input
                  placeholder="이메일(대소문자를 확인해 주세요)"
                  style={areaStyle}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "비밀번호를 입력해 주세요!",
                  },
                ]}
              >
                <Input.Password
                  style={areaStyle}
                  type="password"
                  placeholder="비밀번호"
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="passwordch"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("비밀번호 다시 확인해주세요!"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  style={areaStyle}
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Item>
              <Address onAddressChange={updateAddressInfo} />
              <Form.Item
                name="lastaddress"
                rules={[
                  {
                    required: true,
                    message: "상세주소를 입력하세요.",
                  },
                  {
                    max: 10,
                    message: "상세주소는 최대 10자까지 입력 가능합니다.",
                  },
                ]}
              >
                <Input
                  style={{ height: 60, fontSize: "20px" }}
                  onChange={e => setlastaddress(e.target.value)}
                  placeholder="상세주소"
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={buttonPrimaryStyle}
              >
                회원가입
              </Button>
            </Form.Item>
          </Form>
        </SignWrap>
      </LoginWrap>
    </div>
  );
};

export default SignupPage;
