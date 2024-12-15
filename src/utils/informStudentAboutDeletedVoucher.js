import formatISODate from "./formatDate";
import { sendMail } from "./sendMail";

export async function informStudentAboutDeletedVoucher(data) {
  try {
    console.log(data);

    const mailBody = `
  <br>Dear <b>${data?.name}</b>,
  <br><br>We regret to inform you that the following transport voucher has been marked as <span style="color: red; font-weight: bold;">UNISSUED</span>:
  <br>
  <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Detail</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Information</th>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">Name</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${data?.name}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">Registration No.</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${data?.reg}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">Program</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${data?.program}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">Route</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${data?.route}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">Bus</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${data?.bus?.name} (${
      data?.bus?.number
    })</td>
    </tr>
  </table>
  <br>
  <strong>Voucher ID:</strong> ${data?.voucherId}
  <br><br>
  <strong>Fee Interval Details:</strong>
  <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">From Date</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">To Date</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Issue Date</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Due Date</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">No. of Months</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Names of Months</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Fee (PKR)</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fine Per Day (PKR)</th>
    </tr>
    ${data?.feeIntervals
      .map(
        (interval) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${formatISODate(
          interval.from
        )}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formatISODate(
          interval.to
        )}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formatISODate(
          interval.issueDate
        )}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formatISODate(
          interval.dueDate
        )}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          interval.noOfMonths
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          interval.namesOfMonths.length > 0
            ? interval.namesOfMonths.join(", ")
            : ""
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${interval.totalAmount.toLocaleString()}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${interval.finePerDay.toLocaleString()}</td>
      </tr>`
      )
      .join("")}
  </table>
  <br>
  We apologize for any inconvenience caused. If you have any questions or concerns, please contact us at 
  <a href="mailto:${process.env.SUPPORT_EMAIL}">${
      process.env.SUPPORT_EMAIL
    }</a>.
  <br><br>Best regards,<br>Pafiast Transport
`;

    await sendMail(
      data?.email,
      `Transport Voucher Marked as Unissued - ${data?.name}`,
      mailBody
    );
  } catch (error) {
    console.error(error);
  }
}
