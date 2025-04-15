import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideEdit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Employee, Project, PayrollItem } from '../../../../helper/type';
import { Input } from '@/components/ui/input';
import axios from "../../../../plugin/axios"; // Ensure correct import path for axios
import Swal from 'sweetalert2';

interface DialogEditProps {
  item: PayrollItem;
  projects: Project[];
  employees: Employee[];
  updatePayrollItem: (updatedItem: PayrollItem) => void;
}

function DialogEdit({ item, projects, employees, updatePayrollItem }: DialogEditProps) {
  const [open, setOpen] = useState(false); // State to manage dialog open/close
  const [selectedProject, setSelectedProject] = useState(item.project);
  const [selectedEmployee, setSelectedEmployee] = useState(item.name);
  const [selectedRate, setSelectedRate] = useState(() => {
    const employee = employees.find(emp => `${emp.first_name} ${emp.last_name}` === item.name);
    return employee ? employee.rate.toString() : '0';
  });
  const [dateStart, setDateStart] = useState(item.date_start);
  const [dateEnd, setDateEnd] = useState(item.date_end);
  const [calculatedSalary, setCalculatedSalary] = useState('0.00');

  useEffect(() => {
    calculateSalary();
  }, [selectedRate, dateStart, dateEnd]);

  const handleEmployeeSelect = (employeeName: string) => {
    setSelectedEmployee(employeeName);
    const employee = employees.find(emp => `${emp.first_name} ${emp.last_name}` === employeeName);
    if (employee) {
      setSelectedRate(employee.rate.toString());
    }
  };

  const calculateSalary = () => {
    if (selectedRate && dateStart && dateEnd) {
      const fromDate = new Date(dateStart);
      const toDate = new Date(dateEnd);
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24) + 1; // +1 to include both start and end dates
      const total = daysDiff * parseFloat(selectedRate);
      setCalculatedSalary(total.toFixed(2));
    }
  };

  const handleSaveChanges = async () => {
    const updatedItem = {
      ...item,
      project: selectedProject,
      name: selectedEmployee,
      date_start: dateStart,
      date_end: dateEnd,
      salary: calculatedSalary,
    };

    try {
      // Send PUT or PATCH request to update the item on the server
      await axios.put(`/payroll/${item.id}/`, updatedItem, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('eprojex_auth_token')}`,
        },
      });

      // Update local state
      setOpen(false);
      updatePayrollItem(updatedItem);
      Swal.fire({
        title: 'Payroll Updated',
        text: 'Payroll updated successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // Close the dialog
      
      console.log('Item updated successfully.');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='flex items-center h-10 w-10 gap-2 bg-green-600 text-white hover:bg-green-500 hover:text-white'>
            <LucideEdit2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className='text-start'>Edit Payroll</DialogTitle>
            <DialogDescription className='text-start'>
              Make changes to your payroll here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-start">
                Project
              </Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className='uppercase col-span-3'>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.name} className='uppercase'>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-start">
                Employee
              </Label>
              <Select value={selectedEmployee} onValueChange={handleEmployeeSelect}>
                <SelectTrigger className='uppercase col-span-3'>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={`${employee.first_name} ${employee.last_name}`} className='uppercase'>
                        {`${employee.first_name} ${employee.last_name}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateStart" className="text-start">
                Date from:
              </Label>
              <Input className='col-span-3' type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateEnd" className="text-start">
                Date to:
              </Label>
              <Input className='col-span-3' type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-start">
                Rate:
              </Label>
              <Input className='col-span-3' type="text" value={selectedRate} readOnly />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-start">
                Salary:
              </Label>
              <Input className='col-span-3' type="text" value={calculatedSalary} readOnly />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogEdit;