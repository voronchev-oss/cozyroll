import { headers } from "next/headers";
// ...
function pickCsrfFromHeaders(h: Headers) {
  const raw = h.get("cookie") || "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export default async function AdminProducts() {
  const h = headers();
  const csrf = pickCsrfFromHeaders(h);

  const items = await listProducts();

  return (
    <div>
      {/* ... */}
      {items.map(p => (
        <form key={p.id} action="/api/products/delete" method="POST" className="inline">
          <input type="hidden" name="csrf" value={csrf} />
          <input type="hidden" name="id" value={p.id} />
          <button className="btn-danger">Удалить</button>
        </form>
      ))}
    </div>
  );
}


          {items.length === 0 && (
            <tr>
              <td className="py-6 text-muted" colSpan={5}>
                Товаров пока нет.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
