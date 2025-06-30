
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkConditionsSectionProps {
  form: UseFormReturn<any>;
}

const WorkConditionsSection: React.FC<WorkConditionsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg border-b pb-2">Условия работы</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="employment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>График работы</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите график" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="full-time">Полный день</SelectItem>
                  <SelectItem value="part-time">Частичная занятость</SelectItem>
                  <SelectItem value="online">Онлайн</SelectItem>
                  <SelectItem value="flexible">Гибкий график</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Город / Локация</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Например: Москва, Санкт-Петербург" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Зарплата (по желанию)</Label>
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="salary_min"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="От"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary_max"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="До"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="experience_required"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Требуемый опыт (лет)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="application_deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Крайний срок подачи заявок</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="housing_provided"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Предоставляется жилье
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default WorkConditionsSection;
