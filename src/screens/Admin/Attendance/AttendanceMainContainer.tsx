import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, LucideTrash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';
import axios from "../../../plugin/axios";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import DialogAttendance from './children/DialogAddPayroll';
import DialogEdit from './children/DialogEdit';
import { Employee, Project } from '../../../helper/type';
import Swal from 'sweetalert2';

interface PayrollItem {
  id: number;
  projectId: string;
  project: string;
  name: string;
  date_start: string;
  date_end: string;
  salary: string;
}

const AttendanceMainContainer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const minWage = 500.00;
  const [totalSalary, setTotalSalary] = useState('0.00');
  const [activeProject, setActiveProject] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payroll, setPayroll] = useState<PayrollItem[]>([]);
  const [filteredData, setFilteredData] = useState<PayrollItem[]>([]);

  const getEmployees = async () => {
    try {
      const response = await axios.get('users/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('eprojex_auth_token')}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const getProjects = async () => {
    try {
      const response = await axios.get('project/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('eprojex_auth_token')}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchPayroll = async () => {
    try {
      const response = await axios.get('/payroll/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('eprojex_auth_token')}`,
        },
      });
      setPayroll(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/payroll/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('eprojex_auth_token')}`,
        },
      });

      const updatedPayroll = payroll.filter(item => item.id !== id);
      setPayroll(updatedPayroll);
      setFilteredData(updatedPayroll);

      Swal.fire({
        icon: 'success',
        title: 'Deleted successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(`Item with id ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const updatePayrollItem = (updatedItem: PayrollItem) => {
    const updatedPayroll = payroll.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setPayroll(updatedPayroll);
    setFilteredData(updatedPayroll);
  };

  useEffect(() => {
    getEmployees();
    getProjects();
    fetchPayroll();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleProjectChange = (projectName: string) => {
    if (projectName === "all") {
      setActiveProject("all");
      setSelectedEmployee("");
      setDateFrom("");
      setDateTo("");
      setValue("");
      setFilteredData(payroll);
    } else {
      setActiveProject(projectName);
      applyFilters(projectName, selectedEmployee, dateFrom, dateTo);
    }
  };

  const handleEmployeeChange = (employee: string) => {
    setSelectedEmployee(employee);
    applyFilters(activeProject, employee, dateFrom, dateTo);
  };

  const applyFilters = (
    projectName = activeProject,
    employeeName = selectedEmployee,
    start = dateFrom,
    end = dateTo
  ) => {
    const filtered = payroll.filter(item => {
      const matchesProject = projectName === "all" || item.project === projectName;
      const matchesEmployee = employeeName === "" || item.name.toLowerCase().includes(employeeName.toLowerCase());
      const matchesDateFrom = !start || new Date(item.date_start) >= new Date(start);
      const matchesDateTo = !end || new Date(item.date_end) <= new Date(end);
      return matchesProject && matchesEmployee && matchesDateFrom && matchesDateTo;
    });
    setFilteredData(filtered);
  };

  const calculateTotalSalary = () => {
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24) + 1;
      const total = daysDiff * minWage;
      setTotalSalary(total.toFixed(2));
    }
  };

  return (
    <div className='flex flex-col gap-4 p-3 mt-16'>
      <div className="text-2xl font-bold mb-5">List of Payroll</div>
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <div className='grid grid-cols-4 gap-4 mb-5'>
          <div>
            <label>Select Project:</label>
            <Select onValueChange={handleProjectChange}>
              <SelectTrigger className='uppercase'>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all" className='uppercase'>All</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.name} className='uppercase'>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label>Select Employee:</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full uppercase flex justify-between text-left"
                >
                  {value
                    ? (() => {
                        const employee = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === value);
                        return employee ? `${employee.first_name} ${employee.last_name}` : "Search Employee...";
                      })()
                    : "Search Employee..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search Employee..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <CommandGroup className='uppercase'>
                      {employees.map((employee) => (
                        <CommandItem
                          key={employee.id}
                          value={`${employee.first_name} ${employee.last_name}`}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue);
                            handleEmployeeChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          {`${employee.first_name} ${employee.last_name}`}
                          <Check
                            className={cn(
                              "ml-auto text-green-500",
                              value === `${employee.first_name} ${employee.last_name}` ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label htmlFor="dateFrom">Date from:</label>
            <Input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                applyFilters(activeProject, selectedEmployee, e.target.value, dateTo);
                calculateTotalSalary(); // Calculate total salary on date change
              }}
            />
          </div>

          <div>
            <label htmlFor="dateTo">Date to:</label>
            <Input
              type="date"
              id="dateTo"
              name="dateTo"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                applyFilters(activeProject, selectedEmployee, dateFrom, e.target.value);
                calculateTotalSalary(); // Calculate total salary on date change
              }}
            />
          </div>
        </div>

        <div className="mb-5" hidden>
          <label>Total Salary:</label>
          <div className="text-lg font-bold">{totalSalary}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date From</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-center text-red-500">
                    No record found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{item.project}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{item.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{formatDate(item.date_start)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{formatDate(item.date_end)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">PHP {item.salary}</td>
                    <td>
                      <div className='flex flex-row gap-2'>
                        <DialogEdit
                          item={item}
                          projects={projects}
                          employees={employees}
                          updatePayrollItem={updatePayrollItem}
                        />
                        <Button onClick={() => handleDelete(item.id)} className='bg-red-400 hover:bg-red-500 text-white rounded-md p-2'>
                          <LucideTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
        
      </div>

      <div className='sticky bottom-20 right-5 flex justify-end items-center'>
        <div className='flex items-center gap-2'>
          <DialogAttendance employees={employees} projects={projects} fetchPayroll={fetchPayroll} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceMainContainer;