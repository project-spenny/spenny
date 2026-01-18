import { CATEGORIES } from '@/constants/categories';

const expenseCATEGORIES = CATEGORIES.expense
  .map((cat) => `"${cat.category_key}"`)
  .join('|');

const promptText = `
Extract receipt data from this image and return only a valid JSON Object


CRITICAL DATE PARSING RULES:
1. Date formats commonly found on Korean receipts:
  - YY/MM/DD (e.g., 26/02/22 = 2026-02-22)
  - YY.MM.DD (e.g., 26.02.22 = 2026-02-22)
  - YYYY/MM/DD, YYYY.MM.DD, YYYY-MM-DD
  - YY년 MM월 DD일

2. Year interpretation (CRITICAL):
  - Current date context: ${new Date().toISOString().split('T')[0]}
  - If 2-digit year (YY):
    * 00-40 → 20YY (2000-2040)
    * 41-99 → 19YY (1941-1999)
  - Example: 26/02/22 → 2026-02-22 (NOT 1926)
  - Example: 95/12/31 → 1995-12-31

3. Ambiguous date formats (DD/MM/YY vs MM/DD/YY):
  - Korean receipts typically use YY/MM/DD or DD/MM/YY
  - If day > 12, it must be DD/MM/YY format
  - Example: 26/02/22 → day=26, so format is DD/MM/YY → 2022-02-26
  - Example: 05/03/24 → ambiguous, assume DD/MM/YY → 2024-03-05

4. Validation:
  - Month must be 01-12
  - Day must be valid for that month
  - If date seems future (>1 year from now), check interpretation
  - If date seems too old (>5 years), check interpretation


Rules
1. extract total amount, remove non numeric characters
2. title is clean store name , remove special characters
3. category_id is in ${expenseCATEGORIES}

Output JSON Format
{
  "title": "store name(string)",
  "date": "YYYY-MM-DD"(ISO-format, apply rules above),
  "category_id": ${expenseCATEGORIES}
  "amount" 결제금액
}

if not receipt
{
  "error" : "영수증이 아닙니다"
}

Return ONLY the JSON obejct, no explanation
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
