import React, { useEffect, useState } from "react"
import { Layout, Menu, Button, Typography, Radio } from "antd"
import { Certificate, getCertificate, getUserCertificates } from "crypto-pro"
import styles from "./styles.module.scss"
import { formatDate } from "./utils"
import { api } from "./api/myApi"
import Cookies from "js-cookie"
import { useAuth } from "./AuthContext"
import forge from "node-forge"
import { Tasks } from "./Tasks"

const { Header, Content, Sider } = Layout
const { Text } = Typography

export const Reportings = () => {
  const [certificate, setCertificate] = useState<string | null>(null)
  const { logout } = useAuth()
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const [step, setStep] = useState(0)
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  )

  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [certificatesError, setCertificatesError] = useState<string | null>(
    null
  )

  const [certificateDetails, setCertificateDetails] =
    useState<Certificate | null>(null)
  const [detailsError, setDetailsError] = useState(null)

  useEffect(() => {
    const funct = async () => {
      try {
        setCertificates(await getUserCertificates())
      } catch (error) {
        if (error instanceof Error) {
          setCertificatesError(error.message)
        } else {
          setCertificatesError("An unknown error occurred")
        }
      }
    }
    funct()
  }, [])

  useEffect(() => {
    const fetch = async () => {
      const certificateRes = await getCertificate(selectedCertificate || "")
      const base64 = await certificateRes.exportBase64()
      console.log(certificateRes.thumbprint)
      console.log(base64)
      setCertificate(base64)
      setCertificateDetails(certificateRes)
    }
    selectedCertificate && fetch()
  }, [selectedCertificate])

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const rest =
        await api.users.userRegistrationStatusesUsersRegistrationStatusesGet({
          headers,
        })
      const rest1 = await api.users.userAstralInfoUsersGet({
        headers,
      })
      if (rest1.data.registration_status == "certificate_added")
        setIsAdded(true)
      else setIsAdded(false)

      //rest1.data.certificate && console.log(rest1.data.certificate)
    }
    fetch()
  }, [])

  const sendCertificate = async () => {
    await api.users.userCertificateUpdateUsersRegistrationCertificatePut(
      {
        certificate: certificate || "",
      },
      { headers }
    )
    setStep(3)
  }
  return (
    <Layout style={{ height: "100vh" }}>
      {/* Левый сайдбар с логотипом и меню */}
      <Sider
        width={200}
        style={{
          background: "#fff",
          borderRight: "1px solid",
          borderColor: "black",
        }}
      >
        <div
          style={{ padding: "16px", textAlign: "center", fontWeight: "bold" }}
        >
          Логотип
        </div>
        <Menu
          mode="vertical"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%" }}
        >
          <Menu.Item key="1">События</Menu.Item>
          <Menu.Item key="2">Операции</Menu.Item>
          <Menu.Item key="3">Отчетность</Menu.Item>
          <Menu.Item key="4">Настройки</Menu.Item>
          <Button onClick={() => logout()}>{"Выйти"}</Button>
        </Menu>
      </Sider>

      {/* Основной контент */}
      <Layout>
        <Header
          style={{ background: "#fff", padding: 0, textAlign: "center" }}
        ></Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isAdded ? (
            step === 0 ? (
              <div className={styles["content-wrapper"]}>
                <Text className={styles["title-font"]}>
                  {"Сертификат зарегистрирован"}
                </Text>
                <Text className={styles["text-description"]}>
                  {"Можете перейти в задачи или обновить сертификат"}
                </Text>

                <Button
                  type="primary"
                  style={{ marginTop: 16, width: "200px" }}
                  onClick={() => {
                    setIsAdded(false)
                    setStep(1)
                  }}
                >
                  Обновить сертификат
                </Button>
                <Button
                  type="primary"
                  style={{ marginTop: 16, width: "200px" }}
                  onClick={() => setStep(1)}
                >
                  Перейти в задачи
                </Button>
              </div>
            ) : step === 1 ? (
              <Tasks />
            ) : (
              <></>
            )
          ) : step === 0 ? (
            <div className={styles["content-wrapper"]}>
              <Text className={styles["title-font"]}>
                {"Подготовка компьютера"}
              </Text>
              <Text className={styles["text-description"]}>
                {"Установите компоненты КриптоПро"}
              </Text>
              <Text className={styles["text-description"]}>
                {"Установите Токен в компьютер"}
              </Text>
              <Text className={styles["text-description"]}>
                {"Добавьте сертификат в корневое хранилище устройства"}
              </Text>
              <Button
                type="primary"
                style={{ marginTop: 16, width: "200px" }}
                onClick={() => setStep(1)}
              >
                Регистрация
              </Button>
            </div>
          ) : step === 1 ? (
            <div className={styles["content-wrapper"]}>
              <Text className={styles["title-font"]}>
                {"Выберите действующий сертификат вашей компании"}
              </Text>
              <Radio.Group
                onChange={(e) => setSelectedCertificate(e.target.value)}
                value={selectedCertificate}
              >
                <div className={styles["certificates-wrapper"]}>
                  {certificates.map(({ name, thumbprint, validTo }) => (
                    <div
                      key={thumbprint}
                      style={{ marginBottom: "8px", textAlign: "left" }}
                    >
                      <Radio value={thumbprint} />
                      <Text>
                        {name +
                          " (действителен до: " +
                          formatDate(validTo) +
                          ")"}
                      </Text>
                    </div>
                  ))}
                </div>
              </Radio.Group>
              <Button
                type="primary"
                style={{ marginTop: 16, width: "200px" }}
                onClick={() => setStep(2)}
                disabled={!selectedCertificate}
              >
                Продолжить
              </Button>
            </div>
          ) : step === 2 ? (
            <div className={styles["content-wrapper"]}>
              <Text className={styles["title-font"]}>{"Проверьте данные"}</Text>
              {certificateDetails ? (
                <>
                  <Text className={styles["text-description"]}>
                    {"Имя:" + certificateDetails.name}
                  </Text>
                  <Text className={styles["text-description"]}>
                    {certificateDetails.issuerName}
                  </Text>
                  <Text className={styles["text-description"]}>
                    {" "}
                    {certificateDetails.subjectName}
                  </Text>

                  <Text className={styles["text-description"]}>
                    {"Действительно от:" +
                      formatDate(certificateDetails.validFrom)}
                  </Text>
                  <Text className={styles["text-description"]}>
                    {"Действительно до:" +
                      formatDate(certificateDetails.validTo)}
                  </Text>
                </>
              ) : null}
              <Button
                type="primary"
                style={{ marginTop: 16, width: "200px" }}
                onClick={sendCertificate}
              >
                Отправить
              </Button>
            </div>
          ) : (
            <div className={styles["content-wrapper"]}>
              <Text className={styles["title-font"]}>
                {"Данные отправлены"}
              </Text>
              <Text className={styles["text-description"]}>
                {
                  "Мы передали данные по Сертификату в Удостоверяющий центр, ожидайте ответа"
                }
              </Text>
            </div>
          )}
        </Content>
      </Layout>

      {/* Правый блок с сертификатами */}
      <Sider
        width={300}
        style={{
          background: "#fff",
          padding: "16px",
          marginRight: "16px",
          marginTop: "16px",
          border: "1px solid",
          borderColor: "black",
          borderRadius: "8px",
          height: "500px",
        }}
      >
        <div style={{ fontWeight: "bold" }}>Действующие сертификаты</div>
        <div>Информация о сертификатах</div>
      </Sider>
    </Layout>
  )
}

export default Reportings
