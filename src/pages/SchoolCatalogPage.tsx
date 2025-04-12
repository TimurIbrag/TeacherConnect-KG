
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Search, 
  PlusCircle,
  MapPin,
  School
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock data for schools
const privateSchools = [
  { id: 1, name: 'Международная школа "Silk Road"', address: 'г. Бишкек, ул. Ахунбаева, 97', region: 'Бишкек' },
  { id: 2, name: 'Oxford International School', address: 'г. Бишкек, ул. Льва Толстого, 100', region: 'Бишкек' },
  { id: 3, name: 'Элитная школа "Эрудит"', address: 'г. Ош, ул. Ленина, 287', region: 'Ош' },
  { id: 4, name: 'Частная гимназия "Алтын Уя"', address: 'г. Бишкек, ул. Медерова, 44', region: 'Бишкек' },
  { id: 5, name: 'Cambridge School Bishkek', address: 'г. Бишкек, ул. Горького, 27/1', region: 'Бишкек' },
  { id: 6, name: 'Hope Academy', address: 'г. Бишкек, ул. Тыныстанова, 98', region: 'Бишкек' },
  { id: 7, name: 'Школа "Олимп"', address: 'г. Каракол, ул. Токтогула, 254', region: 'Иссык-Кульская' },
  { id: 8, name: 'Академия "Сапат"', address: 'г. Бишкек, ул. Анкара, 1/5', region: 'Бишкек' }
];

const publicSchools = [
  { id: 101, name: 'Школа-гимназия №5', address: 'г. Бишкек, ул. Московская, 145', region: 'Бишкек' },
  { id: 102, name: 'Школа №55 им. Ч. Айтматова', address: 'г. Бишкек, ул. Тыныстанова, 33', region: 'Бишкек' },
  { id: 103, name: 'Школа-лицей №13', address: 'г. Бишкек, ул. Абдрахманова, 47', region: 'Бишкек' },
  { id: 104, name: 'Школа №24', address: 'г. Ош, ул. Ленина, 88', region: 'Ош' },
  { id: 105, name: 'Школа-гимназия №17', address: 'г. Бишкек, ул. Купянская, 52', region: 'Бишкек' },
  { id: 106, name: 'Школа №2 г. Каракол', address: 'г. Каракол, ул. Жамансариева, 154', region: 'Иссык-Кульская' },
  { id: 107, name: 'Средняя школа №11', address: 'г. Джалал-Абад, ул. Барпы, 37', region: 'Джалал-Абадская' },
  { id: 108, name: 'Школа-лицей "Санат"', address: 'г. Нарын, ул. Раззакова, 15', region: 'Нарынская' },
  { id: 109, name: 'Школа №6 им. А.С. Пушкина', address: 'г. Талас, ул. Ленина, 250', region: 'Таласская' },
  { id: 110, name: 'Школа №8', address: 'г. Баткен, ул. Семетей, 41', region: 'Баткенская' },
  { id: 111, name: 'Школа №45', address: 'г. Бишкек, ул. Юнусалиева, 93', region: 'Бишкек' },
  { id: 112, name: 'Школа-гимназия №29', address: 'г. Бишкек, ул. Бакаева, 132', region: 'Бишкек' }
];

const regions = [
  'Все регионы',
  'Бишкек',
  'Ош',
  'Чуйская',
  'Иссык-Кульская',
  'Нарынская',
  'Джалал-Абадская',
  'Таласская',
  'Баткенская'
];

// Form schema for adding a new school
const newSchoolSchema = z.object({
  name: z.string().min(3, { message: "Название школы должно содержать не менее 3 символов" }),
  address: z.string().min(5, { message: "Адрес должен содержать не менее 5 символов" }),
  type: z.enum(["private", "public"], { required_error: "Выберите тип школы" }),
  region: z.string().min(1, { message: "Выберите регион" }),
  description: z.string().optional()
});

type NewSchoolFormValues = z.infer<typeof newSchoolSchema>;

const SchoolCatalogPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [schoolType, setSchoolType] = useState<string>('public');
  const [selectedRegion, setSelectedRegion] = useState<string>('Все регионы');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  // Filter schools based on type, region and search term
  const getFilteredSchools = () => {
    const schools = schoolType === 'private' ? privateSchools : publicSchools;
    
    return schools.filter(school => {
      const matchesRegion = selectedRegion === 'Все регионы' || school.region === selectedRegion;
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           school.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesRegion && matchesSearch;
    });
  };
  
  const filteredSchools = getFilteredSchools();
  
  // Form for adding a new school
  const form = useForm<NewSchoolFormValues>({
    resolver: zodResolver(newSchoolSchema),
    defaultValues: {
      name: "",
      address: "",
      type: "public",
      region: "Бишкек",
      description: ""
    }
  });
  
  // Handle school selection
  const handleSelectSchool = (schoolId: number) => {
    toast({
      title: "Школа выбрана",
      description: "Вы успешно выбрали школу. Перенаправляем в кабинет школы."
    });
    
    // Redirect to school dashboard (with school id)
    setTimeout(() => {
      navigate(`/school-dashboard?id=${schoolId}`);
    }, 1500);
  };
  
  // Handle form submission for adding a new school
  const onSubmit = (data: NewSchoolFormValues) => {
    toast({
      title: "Школа добавлена",
      description: "Ваша школа успешно добавлена в каталог. Перенаправляем в кабинет школы."
    });
    
    setIsDialogOpen(false);
    
    // Redirect to school dashboard
    setTimeout(() => {
      navigate('/school-dashboard');
    }, 1500);
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Выберите вашу школу</CardTitle>
          <CardDescription>
            Пожалуйста, найдите и выберите вашу школу из каталога или добавьте новую
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="public" onValueChange={setSchoolType} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="public" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                Государственная
              </TabsTrigger>
              <TabsTrigger value="private" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Частная
              </TabsTrigger>
            </TabsList>
            
            <div className="my-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию или адресу..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full md:w-60">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="public" className="mt-4 space-y-4">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <Card key={school.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{school.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {school.address}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectSchool(school.id)}
                      >
                        Выбрать
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Школы не найдены</p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Моей школы нет в списке
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Добавить новую школу</DialogTitle>
                        <DialogDescription>
                          Введите информацию о вашей школе
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Название школы</FormLabel>
                                <FormControl>
                                  <Input placeholder="Школа №1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Адрес</FormLabel>
                                <FormControl>
                                  <Input placeholder="г. Бишкек, ул. Примерная, 123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Тип школы</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-6"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="public" id="public" />
                                      <FormLabel htmlFor="public" className="cursor-pointer">
                                        Государственная
                                      </FormLabel>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="private" id="private" />
                                      <FormLabel htmlFor="private" className="cursor-pointer">
                                        Частная
                                      </FormLabel>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Регион</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Выберите регион" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {regions.slice(1).map((region) => (
                                      <SelectItem key={region} value={region}>
                                        {region}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Описание (необязательно)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Кратко опишите вашу школу..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button type="submit">Добавить школу</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="private" className="mt-4 space-y-4">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <Card key={school.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{school.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {school.address}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectSchool(school.id)}
                      >
                        Выбрать
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Школы не найдены</p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Моей школы нет в списке
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Добавить новую школу</DialogTitle>
                        <DialogDescription>
                          Введите информацию о вашей школе
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Название школы</FormLabel>
                                <FormControl>
                                  <Input placeholder="Частная школа 'Эрудит'" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Адрес</FormLabel>
                                <FormControl>
                                  <Input placeholder="г. Бишкек, ул. Примерная, 123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Тип школы</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-6"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="public" id="public" />
                                      <FormLabel htmlFor="public" className="cursor-pointer">
                                        Государственная
                                      </FormLabel>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="private" id="private" />
                                      <FormLabel htmlFor="private" className="cursor-pointer">
                                        Частная
                                      </FormLabel>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Регион</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Выберите регион" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {regions.slice(1).map((region) => (
                                      <SelectItem key={region} value={region}>
                                        {region}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Описание (необязательно)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Кратко опишите вашу школу..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button type="submit">Добавить школу</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolCatalogPage;
