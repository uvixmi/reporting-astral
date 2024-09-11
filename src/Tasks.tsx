import React, { useEffect, useState } from "react"
import {
  Layout,
  Menu,
  Button,
  Typography,
  Radio,
  Progress,
  Tooltip,
  Spin,
  Dropdown,
} from "antd"
import { Certificate, getCertificate, getUserCertificates } from "crypto-pro"
import styles from "./stylestasks.module.scss"
import { api } from "./api/myApi"
import {
  ReportFormat,
  TaskInfo,
  TaskResponse,
  TaskType,
  User,
  userApi,
} from "./api/userApi"
import Cookies from "js-cookie"
import { useAuth } from "./AuthContext"
import { useMediaQuery } from "usehooks-ts"
import cn from "classnames"
import { CONTENT } from "./tasks-contants"
import { ActionsReportIcon } from "./need/actions-report"
import { ActionCurrencyIcon } from "./need/actions-currency"
import { Amount } from "./ui-kit/amount"
import {
  DownloadOutlined,
  LoadingOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { HideEyeIcon } from "./need/hide-eye"
import { ArrowCounterIcon } from "./need/arrow-counter"
import { ButtonOne } from "./ui-kit/button"
import { SelectOne } from "./ui-kit/select"

const { Header, Content, Sider } = Layout
const { Text } = Typography

export const Tasks = () => {
  const [certificate, setCertificate] = useState<string | null>(null)
  const { logout } = useAuth()
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const isMobile = useMediaQuery("(max-width: 1023px)")
  const [tasks, setTasks] = useState<TaskResponse | null>(null)
  const isTablet = useMediaQuery("(max-width: 1439px)")

  const taxesQuarterHeading = (quarter: string, year: number) => {
    const quarterText = quarter.charAt(2)
    const romeQuarter =
      quarterText === "1"
        ? "I кв"
        : quarterText === "2"
          ? "II кв"
          : quarterText === "3"
            ? "III кв"
            : ""

    const yearText =
      CONTENT.TAXES_QUARTER_END + new Date().getFullYear().toString()
    if (quarter === "ZDP") return `${CONTENT.TAXES_TAXBASE_TEXT}  ${year}`
    else if (quarterText === "1" || quarterText === "2" || quarterText === "3")
      return `${CONTENT.TAXES_QUARTER_TEXT} ${romeQuarter} ${year}`
    else return ""
  }

  const getTooltipUsn = (
    accrued_kv: number,
    accrued_amount: number,
    paid_amount: number,
    due_amount: number,
    dueDate: string
  ) => {
    return (
      <div
        style={
          !isMobile
            ? { display: "flex", flexDirection: "column" }
            : { display: "flex", flexDirection: "column", width: "250px" }
        }
      >
        <Text
          style={{
            color: "#fff",
            fontSize: "14px",
            lineHeight: "20px",
            fontFamily: "Inter",
          }}
        >
          {CONTENT.TOOLTIP_USN_TEXT_ONE}
        </Text>
        <Text
          style={
            !isMobile
              ? {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                  textWrap: "nowrap",
                }
              : {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                }
          }
        >
          <Amount
            value={due_amount - (accrued_amount - accrued_kv - paid_amount)}
            className={styles["amount-tooltip"]}
          />
          {CONTENT.TOOLTIP_USN_TEXT_TWO + " "}
          {formatDateString(dueDate)}
        </Text>
        <Text
          style={
            !isMobile
              ? {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                  textWrap: "nowrap",
                }
              : {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                }
          }
        >
          <Amount
            value={accrued_amount - accrued_kv - paid_amount}
            className={styles["amount-tooltip"]}
          />
          {CONTENT.TOOLTIP_USN_TEXT_THREE}
        </Text>
      </div>
    )
  }

  const getTooltipReport = (
    accrued_amount?: number | null,
    accrued_amount_now?: number | null
  ) => {
    if (accrued_amount && accrued_amount_now)
      return (
        <div
          style={
            !isMobile
              ? { display: "flex", flexDirection: "column", width: "385px" }
              : { display: "flex", flexDirection: "column", width: "250px" }
          }
        >
          <Text
            style={
              !isMobile
                ? {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                    textWrap: "nowrap",
                  }
                : {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                  }
            }
          >
            {CONTENT.TOOLTIP_REPORT_TEXT_ONE}
            <Amount
              value={accrued_amount}
              className={styles["amount-tooltip"]}
            />
          </Text>
          <Text
            style={
              !isMobile
                ? {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                    textWrap: "nowrap",
                  }
                : {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                  }
            }
          >
            {CONTENT.TOOLTIP_REPORT_TEXT_TWO}
            <Amount
              value={accrued_amount_now}
              className={styles["amount-tooltip"]}
            />
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: "14px",
              lineHeight: "20px",
              fontFamily: "Inter",
              marginTop: "20px",
            }}
          >
            {CONTENT.TOOLTIP_REPORT_TEXT_THREE}
          </Text>
        </div>
      )
    else return undefined
  }

  const getCurrentDate = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    const formattedDate = `${year}-${month}-${day}`

    return formattedDate
  }
  const getWeekDayWithMonthNumber = (month: number, withNumber?: boolean) => {
    if (month === 1) {
      return withNumber ? "января" : "январь"
    }

    if (month === 2) {
      return withNumber ? "февраля" : "февраль"
    }

    if (month === 3) {
      return withNumber ? "марта" : "март"
    }

    if (month === 4) {
      return withNumber ? "апреля" : "апрель"
    }

    if (month === 5) {
      return withNumber ? "мая" : "май"
    }

    if (month === 6) {
      return withNumber ? "июня" : "июнь"
    }

    if (month === 7) {
      return withNumber ? "июля" : "июль"
    }

    if (month === 8) {
      return withNumber ? "августа" : "август"
    }

    if (month === 9) {
      return withNumber ? "сентября" : "сентябрь"
    }

    if (month === 10) {
      return withNumber ? "октября" : "октябрь"
    }

    if (month === 11) {
      return withNumber ? "ноября" : "ноябрь"
    }

    if (month === 12) {
      return withNumber ? "декабря" : "декабрь"
    }
  }

  const formatToPayDate = (dueDate: string): string | null => {
    const date = new Date(dueDate)

    if (isNaN(date.getTime())) {
      return null
    }

    const day = date.getDate()
    const month = getWeekDayWithMonthNumber(date.getMonth() + 1, true)
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
  }

  const compareDates = (date1: string, date2: string) => {
    const date1Obj = new Date(date1)
    const date2Obj = new Date(date1)
    const date3Obj = new Date(date2)
    date2Obj.setDate(date2Obj.getDate() - 10)

    return date3Obj >= date2Obj && date3Obj <= date1Obj ? 1 : 0
  }

  const formatDateString = (
    inputDate?: string | null,
    time?: boolean
  ): string => {
    if (inputDate) {
      const date = new Date(inputDate)

      if (isNaN(date.getTime())) {
        return inputDate
      }

      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()

      if (time)
        return `${day}.${month}.${year} ${String(date.getHours()).padStart(
          2,
          "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}`
      else return `${day}.${month}.${year}`
    } else {
      const date = new Date()
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()

      if (time)
        return `${day}.${month}.${year} ${String(date.getHours()).padStart(
          2,
          "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}`
      else return `${day}.${month}.${year}`
    }
  }

  const [formedSuccess, setFormedSucces] = useState([
    { task_code: "", year: 0 },
  ])
  const updateIcon = (
    <LoadingOutlined
      style={{
        fontSize: 14,
      }}
      spin
    />
  )

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 22,
      }}
      spin
    />
  )

  const handleSentReport = async (
    task_code: string,
    period_year: number,
    report_code?: string | null
  ) => {}

  const handleSentPayment = (amount: string, year: number) => {}

  const fetchTasks = async () => {
    try {
      const response = await userApi.tasks.getTasksTasksGet({ headers })
      setTasks(response.data)
    } catch (error) {}
  }

  const [isForming, setIsForming] = useState(false)
  const [tasCodeForming, setTaskCodeForming] = useState("")
  const [yearForming, setYearForming] = useState<number | null>(null)

  const handleFormReport = async (task_code: string, year: number) => {
    setIsForming(true)
    setTaskCodeForming(task_code)
    setYearForming(year)
    try {
      const data = {
        report_type: task_code === "ZDP" ? 3 : 2,
        period_type:
          task_code === "ZDP"
            ? 0
            : task_code === "UV1"
              ? 1
              : task_code === "UV2"
                ? 2
                : 3,
        period_year: year,
      }
      await userApi.reports.generateReportsReportsPost(data, { headers })
      setIsForming(false)
      setFormedSucces([...formedSuccess, { task_code: task_code, year: year }])
      try {
        fetchTasks()
      } catch (error) {}
    } catch (error) {
      setIsForming(false)
    }
  }

  const downloadXmlReport = async (
    report_code: string,
    title: string,
    report_date: string
  ) => {
    try {
      const response =
        await userApi.reports.getReportByIdReportsReportIdReportFormatGet(
          report_code,
          ReportFormat.Xml,
          { headers }
        )

      const blob = await response.blob()
      const downloadLink = document.createElement("a")

      downloadLink.href = window.URL.createObjectURL(blob)

      downloadLink.download = `${title} от ${report_date}.xml`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error("Error during API call:", error)
    }
  }

  const downloadPdfReport = async (
    report_code: string,
    title: string,
    report_date: string
  ) => {
    try {
      const response =
        await userApi.reports.getReportByIdReportsReportIdReportFormatGet(
          report_code,
          ReportFormat.Pdf,
          { headers }
        )

      const blob = await response.blob()
      const downloadLink = document.createElement("a")

      downloadLink.href = window.URL.createObjectURL(blob)
      downloadLink.download = `${title} от ${report_date}.pdf`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error("Error during API call:", error)
    }
  }

  const [user, setUser] = useState<User | null>(null)

  const [isSendMode, setIsSendMode] = useState(false)
  const [reportInfo, setReportInfo] = useState<TaskInfo | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await userApi.tasks.getTasksTasksGet({ headers })
        setTasks(response.data)
      } catch (error) {}

      try {
        const token = Cookies.get("token")
        const headers = {
          Authorization: `Bearer ${token}`,
        }
        const response = await userApi.users.currentUserUsersGet({ headers })

        setUser(response.data)
      } catch (error) {}
    }
    fetch()
  }, [])

  const options = [
    {
      label: (
        <ButtonOne className={styles["download-button"]} type="secondary">
          <DownloadOutlined />
          <Text className={styles["xml-pdf-button"]}>{"xml"}</Text>
        </ButtonOne>
      ),
      value: "xml",
    },
    {
      label: (
        <ButtonOne className={styles["download-button"]} type="secondary">
          <DownloadOutlined />
          <Text className={styles["xml-pdf-button"]}>{"pdf"}</Text>
        </ButtonOne>
      ),
      value: "pdf",
    },
  ]

  const [selectedFormat, setSelectedFormat] = useState<"xml" | "pdf">("xml")

  const handleDownload = () => {
    console.log("download")
  }

  const items = [
    {
      key: "xml",
      label: <Text className={styles["label-download"]}>{"xml"}</Text>,
      onClick: () => setSelectedFormat("xml"),
    },
    {
      key: "pdf",
      label: <Text className={styles["label-download"]}>{"pdf"}</Text>,
      onClick: () => setSelectedFormat("pdf"),
    },
  ]
  return !isSendMode ? (
    <div>
      {tasks &&
        tasks.tasks
          .filter((item) => item.type !== TaskType.Other)
          .map((item, index) => (
            <div className={styles["row-item"]} key={index}>
              <div className={styles["row-inner"]}>
                <div className={styles["left-part-row"]}>
                  {!isTablet && (
                    <div
                      className={cn(styles["icon-part"], {
                        [styles["alert-date"]]:
                          new Date() > new Date(item.due_date),
                        [styles["soon-icon"]]: compareDates(
                          item.due_date,
                          getCurrentDate()
                        ),
                      })}
                    >
                      {item.type === "report" ? (
                        <ActionsReportIcon
                          className={cn(styles["default-icon"], {
                            [styles["alert-icon"]]:
                              item.due_date <= getCurrentDate(),
                            [styles["soon-icon"]]: compareDates(
                              item.due_date,
                              getCurrentDate()
                            ),
                          })}
                        />
                      ) : item.type === "fixed_fees" ||
                        item.type === "usn" ||
                        item.type === "income_percentage" ? (
                        <ActionCurrencyIcon
                          className={cn(styles["default-icon"], {
                            [styles["alert-icon"]]:
                              item.due_date <= getCurrentDate(),
                            [styles["soon-icon"]]: compareDates(
                              item.due_date,
                              getCurrentDate()
                            ),
                          })}
                        />
                      ) : null}
                    </div>
                  )}
                  <div className={styles["info-part"]}>
                    <div className={styles["info-title"]}>
                      <div className={styles["date-title-overdue"]}>
                        {isTablet && (
                          <div
                            className={cn(styles["icon-part"], {
                              [styles["alert-date"]]:
                                new Date() > new Date(item.due_date),
                              [styles["soon-icon"]]: compareDates(
                                item.due_date,
                                getCurrentDate()
                              ),
                            })}
                          >
                            {item.type === "report" ? (
                              <ActionsReportIcon
                                className={cn(styles["default-icon"], {
                                  [styles["alert-icon"]]:
                                    item.due_date <= getCurrentDate(),
                                  [styles["soon-icon"]]: compareDates(
                                    item.due_date,
                                    getCurrentDate()
                                  ),
                                })}
                              />
                            ) : item.type === "fixed_fees" ||
                              item.type === "usn" ||
                              item.type === "income_percentage" ? (
                              <ActionCurrencyIcon
                                className={cn(styles["default-icon"], {
                                  [styles["alert-icon"]]:
                                    item.due_date <= getCurrentDate(),
                                  [styles["soon-icon"]]: compareDates(
                                    item.due_date,
                                    getCurrentDate()
                                  ),
                                })}
                              />
                            ) : null}
                          </div>
                        )}
                        {new Date() > new Date(item.due_date) ? (
                          <div className={styles["warning-overdue"]}>
                            <Text
                              className={cn(styles["text-date"], [
                                styles["alert-date"],
                              ])}
                            >
                              {CONTENT.OVERDUE_WARNING}
                            </Text>
                          </div>
                        ) : compareDates(item.due_date, getCurrentDate()) ? (
                          <div className={styles["soon-overdue"]}>
                            <Text
                              className={cn(styles["text-date"], [
                                styles["soon-date"],
                              ])}
                            >
                              {CONTENT.SOON_WARNING}
                            </Text>
                          </div>
                        ) : null}
                        <Text
                          className={cn(styles["text-date"], {
                            [styles["alert-date-text"]]:
                              new Date() > new Date(item.due_date),
                            [styles["soon-date"]]: compareDates(
                              item.due_date,
                              getCurrentDate()
                            ),
                          })}
                        >
                          {"до " + formatToPayDate(item.due_date)}
                        </Text>
                      </div>
                      <Text className={styles["card-title"]}>{item.title}</Text>
                    </div>
                    <Text className={styles["text-description"]}>
                      {item.description}
                    </Text>
                  </div>
                </div>
                <div className={styles["amount-part"]}>
                  <div className={styles["amount-info"]}>
                    {item.type !== "report" && item.due_amount ? (
                      <>
                        <div className={styles["amount-pay"]}>
                          <Text className={styles["amount-heading"]}>
                            {CONTENT.TEXT_AMOUNT_ALREADY_PAID}
                          </Text>
                          <Text className={styles["amount-paid-text"]}>
                            {item.paid_amount ||
                            (item.paid_amount === 0 &&
                              item.paid_amount !== undefined) ? (
                              <Amount
                                value={item.paid_amount}
                                withDecimal
                                decimalStyle="translucent"
                                className={styles["amount-paid-text"]}
                              />
                            ) : null}
                            {" из "}
                            {item.accrued_amount && (
                              <Amount
                                value={item.accrued_amount}
                                withDecimal
                                decimalStyle="translucent"
                                className={styles["amount-paid-text"]}
                              />
                            )}
                          </Text>
                        </div>

                        {item.accrued_amount && (
                          <Progress
                            percent={
                              item.paid_amount &&
                              (item.paid_amount / item.accrued_amount) * 100 > 3
                                ? (item.paid_amount / item.accrued_amount) * 100
                                : 3
                            }
                            showInfo={false}
                            strokeColor={
                              item.due_date <= getCurrentDate()
                                ? "#CF133C"
                                : compareDates(item.due_date, getCurrentDate())
                                  ? "#FF8D00"
                                  : "#6159FF"
                            }
                          />
                        )}
                        <div className={styles["amount-pay"]}>
                          <Text className={styles["amount-heading"]}>
                            {CONTENT.TEXT_AMOUNT_TO_PAY}
                          </Text>
                          <div className={styles["tooltip-amount"]}>
                            {item.due_amount ? (
                              <>
                                {item.accrued_amount_kv &&
                                  item.accrued_amount &&
                                  item.accrued_amount_kv <
                                    item.accrued_amount && (
                                    <Tooltip
                                      zIndex={1000}
                                      title={() =>
                                        item.accrued_amount_kv &&
                                        item.accrued_amount &&
                                        item.paid_amount &&
                                        item.due_amount
                                          ? getTooltipUsn(
                                              item.accrued_amount_kv,
                                              item.accrued_amount,
                                              item.paid_amount,
                                              item.due_amount,
                                              item.due_date
                                            )
                                          : null
                                      }
                                      placement={
                                        !isMobile ? "topRight" : undefined
                                      }
                                      arrow={{ pointAtCenter: true }}
                                      overlayInnerStyle={
                                        !isMobile
                                          ? {
                                              width: "fit-content",
                                            }
                                          : undefined
                                      }
                                      className="tooltip-custom"
                                    >
                                      <InfoCircleOutlined
                                        className={styles["info-icon-amount"]}
                                      />
                                    </Tooltip>
                                  )}
                                <Text className={styles["amount-to-pay-text"]}>
                                  <Amount
                                    value={item.due_amount}
                                    withDecimal
                                    className={styles["amount-to-pay-text"]}
                                  />
                                </Text>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </>
                    ) : (
                      item.type === "report" && (
                        <>
                          <div className={styles["amount-pay"]}>
                            <Text className={styles["amount-heading-quarter"]}>
                              {taxesQuarterHeading(item.task_code, item.year)}
                            </Text>
                            {item.type === "report" && (
                              <div style={{ display: "flex", gap: "6px" }}>
                                {item.accrued_amount_now !== null &&
                                  item.accrued_amount_now !=
                                    item.accrued_amount && (
                                    <Tooltip
                                      zIndex={1000}
                                      title={() =>
                                        getTooltipReport(
                                          item.accrued_amount,
                                          item.accrued_amount_now
                                        )
                                      }
                                      overlayInnerStyle={
                                        !isMobile
                                          ? {
                                              width: "fit-content",
                                            }
                                          : undefined
                                      }
                                      placement={
                                        !isMobile ? "topRight" : undefined
                                      }
                                      className="tooltip-custom"
                                      arrow={{ pointAtCenter: true }}
                                    >
                                      <InfoCircleOutlined
                                        className={styles["report-icon-amount"]}
                                      />
                                    </Tooltip>
                                  )}
                                <Text className={styles["amount-to-pay-text"]}>
                                  {(item.accrued_amount ||
                                    item.accrued_amount === 0.0) && (
                                    <Amount
                                      value={item.accrued_amount}
                                      withDecimal
                                      className={styles["amount-to-pay-text"]}
                                    />
                                  )}
                                </Text>
                              </div>
                            )}
                          </div>
                          {(!item.report_update ||
                            (!formedSuccess.includes({
                              task_code: item.task_code,
                              year: item.year,
                            }) &&
                              !item.report_update)) && (
                            <div className={styles["declaration-wrapper"]}>
                              <Text className={styles["declaration-text"]}>
                                {CONTENT.TEXT_DECLARATION}
                              </Text>

                              {/* <Tooltip title={CONTENT.DECLARATION_TOOLTIP}>
                      <InfoCircleOutlined
                        className={styles["sider-icon"]}
                        size={24}
                      />
                    </Tooltip>*/}
                            </div>
                          )}
                        </>
                      )
                    )}
                  </div>
                  {((item.type === "report" &&
                    item.report_code &&
                    item.report_update) ||
                    formedSuccess.includes({
                      task_code: item.task_code,
                      year: item.year,
                    })) && (
                    <div className={styles["amount-pay"]}>
                      <div className={styles["formed-date"]}>
                        {formedSuccess.includes({
                          task_code: item.task_code,
                          year: item.year,
                        }) ? (
                          <Text className={styles["amount-heading-formed"]}>
                            {CONTENT.TITLE_FORMED + formatDateString("", true)}
                          </Text>
                        ) : (
                          item.report_update && (
                            <Text className={styles["amount-heading-formed"]}>
                              {CONTENT.TITLE_FORMED +
                                formatDateString(item.report_update, true)}
                            </Text>
                          )
                        )}
                      </div>
                      <Button
                        className={styles["paid-button"]}
                        onClick={() =>
                          handleFormReport(item.task_code, item.year)
                        }
                        disabled={
                          isForming &&
                          item.task_code === tasCodeForming &&
                          item.year === yearForming
                        }
                      >
                        {isForming &&
                        item.task_code === tasCodeForming &&
                        item.year === yearForming ? (
                          <Spin indicator={updateIcon} />
                        ) : (
                          <ArrowCounterIcon className={styles["hide-icon"]} />
                        )}

                        {CONTENT.BUTTON_UPDATE}
                      </Button>
                    </div>
                  )}
                  <div className={styles["row-item-buttons"]}>
                    {(item.type === "report" && item.report_code) ||
                    formedSuccess.includes({
                      task_code: item.task_code,
                      year: item.year,
                    }) ? (
                      <div className={styles["row-item-buttons-wrapper"]}>
                        <Dropdown.Button
                          onClick={() =>
                            selectedFormat === "xml"
                              ? item.report_code &&
                                downloadXmlReport(
                                  item.report_code,
                                  item.title,
                                  formatDateString(item.report_update)
                                )
                              : item.report_code &&
                                downloadPdfReport(
                                  item.report_code,
                                  item.title,
                                  formatDateString(item.report_update)
                                )
                          }
                          className={styles["download-button"]}
                          menu={{
                            items,
                            onClick: () =>
                              selectedFormat !== "xml"
                                ? item.report_code &&
                                  downloadXmlReport(
                                    item.report_code,
                                    item.title,
                                    formatDateString(item.report_update)
                                  )
                                : item.report_code &&
                                  downloadPdfReport(
                                    item.report_code,
                                    item.title,
                                    formatDateString(item.report_update)
                                  ),
                          }}
                        >
                          <DownloadOutlined
                            className={styles["xml-pdf-button"]}
                          />
                          <Text className={styles["xml-pdf-button"]}>
                            {selectedFormat}
                          </Text>
                        </Dropdown.Button>
                        <ButtonOne
                          className={styles["download-button"]}
                          type="secondary"
                          onClick={() => {
                            setIsSendMode(true)
                            setReportInfo(item)
                          }}
                        >
                          {"Отправить"}
                        </ButtonOne>
                      </div>
                    ) : (
                      <ButtonOne
                        className={styles["amount-button"]}
                        type="secondary"
                        disabled={
                          isForming &&
                          item.task_code === tasCodeForming &&
                          item.year === yearForming
                        }
                        onClick={() =>
                          item.type === "report"
                            ? handleFormReport(item.task_code, item.year)
                            : //openEnsModal(item.due_amount)
                              null
                        }
                      >
                        {item.type === "fixed_fees" ||
                        item.type === "usn" ||
                        item.type === "income_percentage" ? (
                          CONTENT.BUTTON_TO_PAY
                        ) : item.type === "report" ? (
                          isForming &&
                          item.task_code === tasCodeForming &&
                          item.year === yearForming ? (
                            <Spin indicator={antIcon} />
                          ) : (
                            CONTENT.BUTTON_FORM
                          )
                        ) : (
                          ""
                        )}
                      </ButtonOne>
                    )}
                    <Button
                      className={styles["paid-button"]}
                      onClick={() =>
                        item.type === "report"
                          ? handleSentReport(
                              item.task_code,
                              item.year,
                              item.report_code
                            )
                          : item.due_amount !== null &&
                            item.due_amount !== undefined &&
                            handleSentPayment(
                              item.due_amount.toString(),
                              item.year
                            )
                      }
                    >
                      <HideEyeIcon className={styles["hide-icon"]} />
                      {item.type === "report"
                        ? CONTENT.BUTTON_PASSED
                        : CONTENT.BUTTON_PAID}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
    </div>
  ) : (
    <div className={styles["send-wrapper"]}>
      <Text className={styles["send-title-block"]}>
        {"Задача:" + reportInfo?.title}
      </Text>
      <Text className={styles["text-description"]}>
        {"Получатель:" + user?.fns_description}
      </Text>
      <Text className={styles["text-description"]}>
        {"ОКТМО:" + user?.oktmo}
      </Text>
      <Text className={styles["text-description"]}>
        {"Номер отчета:" + reportInfo?.report_code}
      </Text>
      <Text className={styles["text-description"]}>{"pdf"}</Text>
      <Text className={styles["text-description"]}>{"xml"}</Text>
      <Text className={styles["text-description"]}>
        {
          "В случае несоответствия данных, обновите налоговую базу и нажмите обновить в разделе События"
        }
      </Text>

      <div style={{ display: "flex", gap: "8px" }}>
        <Text className={styles["text-description"]}>
          {
            "Нажимая кнопку Отправить, я подтверждаю полноту предоставленных данных и соглашаюсь с условиями предоставления сервиса"
          }
        </Text>
        <ButtonOne type="secondary">{"Отправить"}</ButtonOne>
      </div>
      <ButtonOne
        className={styles["back-button"]}
        type="secondary"
        onClick={() => setIsSendMode(false)}
      >
        {"Назад"}
      </ButtonOne>
    </div>
  )
}
