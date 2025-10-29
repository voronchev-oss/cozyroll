<form action="/api/products/delete" method="POST">
  <input type="hidden" name="id" value={String(p.id)} />
  <input type="hidden" name="csrf" value={csrf} />
  <button className="px-3 py-1 border rounded text-red-600">Удалить</button>
</form>
