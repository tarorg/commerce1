import type { APIRoute } from 'astro';

export const get: APIRoute = async () => {
  const url = "https://commerce-tarframework.turso.io/v2/pipeline";
  const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Mjk2NzQwNjQsImlkIjoiN2ZiNTFhMTgtYjU1My00Y2M2LTkwZWItZDE0ZTcxNDI5ODlhIn0.zxIjODPlBzNcAgQQ70xZj2sI7j7RSAHpYPQUtvyoAHDb4nLGzHAPiVvnJ6qeK7-00F8A6Lz__CSPjdITPZ31BQ";

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
              sql: "SELECT c.*, p.name, p.price FROM cart c JOIN Instances p ON c.product_id = p.id",
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
    const cartItems = data.results[0].response.result.rows.map((row: any) => ({
      id: row[0].value,
      productId: row[1].value,
      name: row[5].value,
      price: parseFloat(row[6].value),
      quantity: parseInt(row[4].value),
    }));

    return new Response(JSON.stringify(cartItems), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cart items' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
