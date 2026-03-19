import CategoryForm from '@/components/admin/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Nueva categoría</h1>
        <p className="text-zinc-500 text-sm mt-1">Completá los datos de la categoría</p>
      </div>
      <CategoryForm />
    </div>
  )
}
