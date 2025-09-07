import * as PostalMime from 'postal-mime';

async function sendToWechat(url, textcontent) {
  const payload = {
    msgtype: "text",
    text: {
        content: textcontent
    }
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) return;
    } catch (error) {}
    if (attempt < 2) await new Promise(r => setTimeout(r, 500));
  }
}

export default {
  async email(message, env) {
    const parser = new PostalMime.default();
    const email = await parser.parse(message.raw);
    
    const textcontent = `新邮件\n主题: ${email.subject || '无主题'}\n\n${email.text || '无正文内容'}`;
    await sendToWechat(env.WEBHOOK_URL, textcontent);
  }

};


