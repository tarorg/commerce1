import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  const url = "https://commerce-tarframework.turso.io/v2/pipeline";
  const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Mjk2NzQwNjQsImlkIjoiN2ZiNTFhMTgtYjU1My00Y2M2LTkwZWItZDE0ZTcxNDI5ODlhIn0.zxIjODPlBzNcAgQQ70xZj2sI7j7RSAHpYPQUtvyoAHDb4nLGzHAPiVvnJ6qeK7-00F8A6Lz__CSPjdITPZ31BQ";

  const { productId, quantity } = await request.json();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          { 
            type: "execute", 
            stmt: { 
              sql: "INSERT INTO cart (product_id, quantity) VALUES (?, ?)",
              args: [productId, quantity]
            } 
          },
          { type: "close" },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to add to cart' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
