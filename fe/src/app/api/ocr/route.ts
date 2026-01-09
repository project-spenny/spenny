import { CATEGORIES } from '@/constants/categories';

const expenseCATEGORIES = CATEGORIES.expense
  .map((cat) => `"${cat.category_key}"`)
  .join('|');

const promptText = `
한국의 영수증 OCR 분석
이 영수증 이미지를 정확하게 분석해줘

규칙:
1. 금액은 숫자만 추출
2. 품목의 모든 결제 금액을 더해 총액을 계산
3. 모든 품목의 금액 총합과 총 결제 금액으로 명시된 금액을 비교하여 판단
4. 아래 JSON 형식으로 결과를 출력
5. 영수증이 아니라고 인식되었을 경우 에러처리
JSON 형식:
영수증이 아닌 경우 :
{
  "error" : "영수증이 아닙니다"
}
영수증인 경우 :
{
  "title": "가게명/거래처 명",
  "date": "YYYY-MM-DD",
  "category_id": ${expenseCATEGORIES} 중 하나,
  "amount" 결제금액
}
다른 대답 없이 JSON 형식으로만 추출할 것  
`;
export const POST = async (request: Request) => {
  try {
    const { image } = await request.json();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptText,
              },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data }, { status: response.status });
    }
    const content = data.choices[0].message.content;

    if (!content) {
      return Response.json(
        { error: '응답을 받지 못했습니다' },
        { status: 500 }
      );
    }

    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (parsed.error) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }
    return Response.json(JSON.parse(cleaned));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
