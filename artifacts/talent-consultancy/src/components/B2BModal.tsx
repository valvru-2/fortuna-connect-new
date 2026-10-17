import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, Loader2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { b2bTranslations, type Language, type Translations } from '../content';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

type Values = {
  company: string;
  contact: string;
  email: string;
  service: string;
  vacancies: string;
};

export default function B2BModal({
  open,
  onOpenChange,
  language,
  t,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  t: Translations;
}) {
  const copy = b2bTranslations[language];

  const schema = useMemo(() => z.object({
    company: z.string().trim().min(1, copy.errors.required),
    contact: z.string().trim().min(1, copy.errors.required),
    email: z.string().trim().email(copy.errors.email),
    service: z.string().min(1, copy.errors.service),
    vacancies: z.string().regex(/^[1-9]\d*$/, copy.errors.vacancies),
  }), [copy]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { company: '', contact: '', email: '', service: '', vacancies: '1' },
  });

  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setComplete(false);
      setErrorMessage(null);
      form.reset({ company: '', contact: '', email: '', service: '', vacancies: '1' });
    }
  };

  const onSubmit = async (values: Values) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud.');
      }

      setComplete(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'No se pudo enviar la consulta. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="b2b-dialog" closeLabel={copy.close}>
        {complete ? (
          <div className="b2b-success" role="status" data-testid="status-b2b-success">
            <div className="completion-mark"><Check size={24} aria-hidden="true" /></div>
            <DialogHeader>
              <DialogTitle>{copy.successTitle}</DialogTitle>
              <DialogDescription>{copy.success}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 p-4 border border-blue-500/30 bg-blue-950/20 text-sm space-y-2">
              <p className="font-semibold text-white flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" /> ¿Prefieres coordinar ahora?
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Puedes agendar una sesión exploratoria de 15 minutos directamente con nuestro equipo de consultores.
              </p>
              <a
                href="https://calendly.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block mt-1 text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Abrir calendario de disponibilidad →
              </a>
            </div>

            <button className="button-primary mt-6" type="button" onClick={() => close(false)} data-testid="button-b2b-done">
              {copy.close}
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="b2b-heading">
              <span className="eyebrow">{copy.cta}</span>
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogDescription>{copy.description}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="b2b-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="b2b-field">
                      <FormLabel>{copy.company}</FormLabel>
                      <FormControl>
                        <input {...field} required autoComplete="organization" placeholder="Ej: Acme Corp" data-testid="input-b2b-company" />
                      </FormControl>
                      <FormDescription className="sr-only">{copy.errors.required}</FormDescription>
                      <FormMessage className="b2b-error" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem className="b2b-field">
                        <FormLabel>{copy.contact}</FormLabel>
                        <FormControl>
                          <input {...field} required placeholder="Nombre y apellido" autoComplete="name" data-testid="input-b2b-contact" />
                        </FormControl>
                        <FormDescription className="sr-only">{copy.errors.required}</FormDescription>
                        <FormMessage className="b2b-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="b2b-field">
                        <FormLabel>{copy.email}</FormLabel>
                        <FormControl>
                          <input {...field} type="email" required placeholder="contacto@empresa.com" autoComplete="email" data-testid="input-b2b-email" />
                        </FormControl>
                        <FormDescription className="sr-only">{copy.errors.email}</FormDescription>
                        <FormMessage className="b2b-error" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem className="b2b-field">
                          <FormLabel>{copy.service}</FormLabel>
                          <FormControl>
                            <select {...field} required data-testid="select-b2b-service">
                              <option value="">{copy.chooseService}</option>
                              {t.services.items.map((item) => (
                                <option key={item.title} value={item.title}>{item.title}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormDescription className="sr-only">{copy.errors.required}</FormDescription>
                          <FormMessage className="b2b-error" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="vacancies"
                      render={({ field }) => (
                        <FormItem className="b2b-field">
                          <FormLabel>{copy.vacancies}</FormLabel>
                          <FormControl>
                            <input {...field} required type="number" min="1" step="1" inputMode="numeric" data-testid="input-b2b-vacancies" />
                          </FormControl>
                          <FormDescription className="sr-only">{copy.errors.required}</FormDescription>
                          <FormMessage className="b2b-error" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-400 mt-2">{errorMessage}</p>
                )}

                <div className="b2b-actions">
                  <button type="button" className="back-button" onClick={() => close(false)} data-testid="button-b2b-cancel">
                    {copy.cancel}
                  </button>
                  <button className="button-primary" type="submit" disabled={submitting} data-testid="button-b2b-submit">
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Enviando...
                      </>
                    ) : (
                      <>
                        {copy.submit} <ArrowRight size={15} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}