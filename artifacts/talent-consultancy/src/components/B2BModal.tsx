import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';
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
    service: z.string().min(1, copy.errors.service),
    vacancies: z.string().regex(/^[1-9]\d*$/, copy.errors.vacancies),
  }), [copy]);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { company: '', contact: '', service: '', vacancies: '1' },
  });
  const [complete, setComplete] = useState(false);

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setComplete(false);
      form.reset({ company: '', contact: '', service: '', vacancies: '1' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="b2b-dialog" closeLabel={copy.close}>
        {complete ? (
          <div className="b2b-success" role="status" data-testid="status-b2b-local-preview">
            <div className="completion-mark"><Check size={24} aria-hidden="true" /></div>
            <DialogHeader>
              <DialogTitle>{copy.successTitle}</DialogTitle>
              <DialogDescription>{copy.success}</DialogDescription>
            </DialogHeader>
            <button className="button-primary" type="button" onClick={() => close(false)} data-testid="button-b2b-done">
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
              <form className="b2b-form" onSubmit={form.handleSubmit(() => setComplete(true))} noValidate>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="b2b-field">
                      <FormLabel>{copy.company}</FormLabel>
                      <FormControl>
                        <input {...field} required autoComplete="organization" data-testid="input-b2b-company" />
                      </FormControl>
                      <FormDescription className="sr-only">{copy.errors.required}</FormDescription>
                      <FormMessage className="b2b-error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem className="b2b-field">
                      <FormLabel>{copy.contact}</FormLabel>
                      <FormControl>
                        <input {...field} required autoComplete="name" data-testid="input-b2b-contact" />
                      </FormControl>
                      <FormDescription className="sr-only">{copy.errors.required}</FormDescription>
                      <FormMessage className="b2b-error" />
                    </FormItem>
                  )}
                />
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
                <div className="b2b-actions">
                  <button type="button" className="back-button" onClick={() => close(false)} data-testid="button-b2b-cancel">
                    {copy.cancel}
                  </button>
                  <button className="button-primary" type="submit" data-testid="button-b2b-submit">
                    {copy.submit} <ArrowRight size={15} aria-hidden="true" />
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
