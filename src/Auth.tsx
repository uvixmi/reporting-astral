import { Typography, Input, Button } from "antd"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import { useState } from "react"
import { useAuth } from "./AuthContext"
import { userApi } from "./api/userApi"

const { Text } = Typography

export const Auth = () => {
  const { login, setRole } = useAuth()
  const [email, setEmail] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [password, setPassword] = useState("")
  return (
    <div className={styles["wrapper-inner"]}>
      <div className={styles["inputs-window"]}>
        <div className={styles["input-item-wrapper"]}>
          <Text className={styles["input-title"]}>{CONTENT.EMAIL_TITLE}</Text>

          <Input
            placeholder={CONTENT.EMAIL_PLACEHOLDER}
            value={email}
            onChange={(event) => {
              setEmail(
                event.target.value.toLowerCase().trim().replace(/\s+/g, "")
              )
            }}
          />
        </div>
        <div className={styles["input-item-wrapper"]}>
          <Text className={styles["input-title"]}>
            {CONTENT.PASSWORD_TITLE}
          </Text>

          <Input.Password
            placeholder={CONTENT.PASSWORD_PLACEHOLDER}
            type="password"
            value={password}
            className={styles["default-input"]}
            autoComplete="off"
            visibilityToggle
            // status={validatePassword(password) ? "error" : ""}
            onChange={(event) => {
              setPassword(event.target.value.trim())
            }}
          />
        </div>

        <Button
          className={styles["button-item"]}
          onClick={async () => {
            try {
              const response = await userApi.auth.loginAuthPost({
                username: email,
                password: password,
              })
              // Проверка наличия свойства data в ответе
              if (response.data) {
                const { token_type, access_token } = response.data

                login(access_token, 86400)
                setRole("account", 86400)
              } else {
                console.error("Отсутствует свойство data в ответе API.")
              }
            } catch (error) {
              console.error("Ошибка при выполнении запроса:", error)
            }
          }}
          disabled={isButtonDisabled}
        >
          {CONTENT.ENTER_BUTTON}
        </Button>
      </div>
    </div>
  )
}
