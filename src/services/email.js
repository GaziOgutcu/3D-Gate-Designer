const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  toEmail: import.meta.env.VITE_INQUIRY_TO_EMAIL || 'info@customautogates.com.au',
}

export function isEmailConfigured() {
  return Boolean(emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey)
}

export async function sendInquiryEmail({ form, summaryRows, screenshotData }) {
  if (!isEmailConfigured()) {
    return { ok: false, reason: 'missing-email-config' }
  }

  const summaryText = summaryRows.map(([label, value]) => `${label}: ${value ?? 'Not selected'}`).join('\n')
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: emailConfig.serviceId,
      template_id: emailConfig.templateId,
      user_id: emailConfig.publicKey,
      template_params: {
        to_email: emailConfig.toEmail,
        from_name: form.name,
        from_email: form.email,
        reply_to: form.email,
        phone: form.phone,
        address: form.address || 'Not provided',
        notes: form.notes || 'None',
        design_summary: summaryText,
        screenshot_image: screenshotData || '',
        screenshot_filename: '3d-gate-design.jpg',
        message: [
          `Name: ${form.name}`,
          `Phone: ${form.phone}`,
          `Customer email: ${form.email}`,
          `Address: ${form.address || 'Not provided'}`,
          '',
          'Design summary:',
          summaryText,
          '',
          'Customer notes:',
          form.notes || 'None',
        ].join('\n'),
      },
    }),
  })

  if (!response.ok) {
    return { ok: false, reason: await response.text() }
  }

  return { ok: true }
}
