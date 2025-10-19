import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Combobox } from "@/components/ui/inputs/combobox";
import { GENDERS, ROLES } from "../constants";

export default function StepProfile({
  form,
  errors,
  touched,
  handleChange,
  handleBlur,
  setForm
}) {
  return (
    <div className="grid gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block">Nombre</Label>
          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tu nombre real"
            autoComplete="given-name"
          />
          {touched.firstName && errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Label className="mb-1 block">Apellido</Label>
          <Input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tu apellido"
            autoComplete="family-name"
          />
          {touched.lastName && errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block">Cédula</Label>
          <Input
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="10 dígitos (solo números)"
          />
          {touched.cedula && errors.cedula && <p className="text-xs text-red-600 mt-1">{errors.cedula}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">Género</Label>
            <Combobox
              options={GENDERS}
              value={form.gender}
              onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
              placeholder="Selecciona tu género"
              searchPlaceholder="Buscar…"
            />
            {touched.gender && errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
          </div>
          <div>
            <Label className="mb-1 block">Rol</Label>
            <Combobox
              options={ROLES}
              value={form.roleName}
              onValueChange={(v) => setForm((f) => ({ ...f, roleName: v }))}
              placeholder="Selecciona tu rol"
              searchPlaceholder="Buscar…"
            />
            {touched.roleName && errors.roleName && <p className="text-xs text-red-600 mt-1">{errors.roleName}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

