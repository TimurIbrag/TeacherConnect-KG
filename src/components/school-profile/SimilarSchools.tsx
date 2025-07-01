import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { schoolsData } from '@/data/mockData';

interface DisplaySchool {
  id: string | number;
  type: string;
}

interface SimilarSchoolsProps {
  currentSchool: DisplaySchool;
}

const SimilarSchools: React.FC<SimilarSchoolsProps> = ({ currentSchool }) => {
  const schoolId = Number(currentSchool.id);
  
  const similarSchools = schoolsData
    .filter(s => s.id !== schoolId && s.type === currentSchool.type)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Похожие школы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarSchools.map(similarSchool => (
            <div key={similarSchool.id} className="flex flex-col gap-2">
              <div className="h-24 w-full rounded-md overflow-hidden">
                <img 
                  src={similarSchool.photo} 
                  alt={similarSchool.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div>
                <p className="text-sm font-medium">{similarSchool.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {similarSchool.address}
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-1" asChild>
                <Link to={`/schools/${similarSchool.id}`}>
                  Просмотр
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/schools">Все школы</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SimilarSchools;