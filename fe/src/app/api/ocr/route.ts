export const POST =async(request)=>{
      const {image} = await request.json();

      const response = await fetch('', {
      headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // 서버에만 존재
      },
      body: JSON.stringify({
                  model: 'gpt-4o-mini',
                  messages: [{
                  role: 'user',
                  content: []
                  }]
            })
      });
      
      return Response.json(await response.json());
}