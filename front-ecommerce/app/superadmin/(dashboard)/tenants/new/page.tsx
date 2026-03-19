import TenantForm from '@/components/superadmin/TenantForm'

export default function NewTenantPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Nuevo cliente</h1>
        <p className="text-zinc-500 text-sm mt-1">Creá una nueva tienda en la plataforma</p>
      </div>
      <TenantForm />
    </div>
  )
}
