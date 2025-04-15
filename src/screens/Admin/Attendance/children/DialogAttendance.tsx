import { useState, useEffect } from 'react';
import axios from '../../../../plugin/axios'; // Import Axios
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LucidePlusCircle } from "lucide-react";
import { Employee, Project } from "../../../../helper/type"; // Adjust the path based on your project structure
import Swal from 'sweetalert2';

interface DialogAttendanceProps {
  employees: Employee[];
  projects: Project[];
  fetchPayroll: () => void; // Add fetchPayroll prop
}

function DialogAttendance({ employees, projects, fetchPayroll }: DialogAttendanceProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [totalSalary, setTotalSalary] = useState('0.00');
  const [selectedRate, setSelectedRate] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [open, setOpen] = useState(false); // Dialog open state

  const [errors, setErrors] = useState({
    project: '',
    employee: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    calculateTotalSalary();
  }, [dateFrom, dateTo, selectedRate]);

  const calculateTotalSalary = () => {
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24) + 1; // +1 to include both start and end dates
      const total = daysDiff * selectedRate;
      setTotalSalary(total.toFixed(2));
    }
  };

  const handleEmployeeSelect = (fullName: string) => {
    const selectedEmployee = employees.find(emp => `${emp.first_name} ${emp.last_name}` === fullName);
    if (selectedEmployee) {
      setSelectedRate(selectedEmployee.rate);
      setSelectedEmployee(fullName);
      setErrors(prevErrors => ({ ...prevErrors, employee: '' }));
    }
  };

  const handleProjectSelect = (projectName: string) => {
    setSelectedProject(projectName);
    setErrors(prevErrors => ({ ...prevErrors, project: '' }));
  };

  const validateInputs = () => {
    const newErrors = {
      project: selectedProject ? '' : 'Project is required.',
      employee: selectedEmployee ? '' : 'Employee is required.',
      dateFrom: dateFrom ? '' : 'Start date is required.',
      dateTo: dateTo ? '' : 'End date is required.',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const resetForm = () => {
    setDateFrom('');
    setDateTo('');
    setTotalSalary('0.00');
    setSelectedRate(0);
    setSelectedEmployee('');
    setSelectedProject('');
    setErrors({
      project: '',
      employee: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      setLoading(true); // Set loading to true
      // Prepare the data to be sent
      const data = {
        project: selectedProject,
        name: selectedEmployee,
        date_start: dateFrom,
        date_end: dateTo,
        salary: totalSalary,
      };

      try {
        // Send the data to the server
        const response = await axios.post('payroll/all/', data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('eprojex_auth_token')}`,
          },
        });
        console.log('Form submitted successfully:', response.data);
        setOpen(false);
        Swal.fire({
          title: 'Attendance Details Added!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          fetchPayroll(); // Refresh payroll data
          setLoading(false); 
          resetForm(); // Reset form fields
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        setLoading(false); // Reset loading state on error
      }
    }
  };

  return (
    <div className='sticky bottom-20 right-5 flex justify-end items-center'>
      <div className='flex items-center gap-2'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <button className="p-2" onClick={() => setOpen(true)}>
              <LucidePlusCircle className='h-16 w-16 text-white bg-primary rounded-full' />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className='text-start'>Add Attendance Details</DialogTitle>
              <DialogDescription className='text-start'>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="grid items-center gap-1.5">
                    <Label htmlFor="project" className='text-base'>Project</Label>
                    <Select onValueChange={handleProjectSelect}>
                      <SelectTrigger className='uppercase'>
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                      <SelectContent className='uppercase'>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.project && <span className="text-red-500 text-sm">{errors.project}</span>}
                  </div>

                  <div className="grid grid-cols-1 items-center gap-1.5">
                    <Label htmlFor="firstName" className='text-base'>Employee</Label>
                    <Select onValueChange={handleEmployeeSelect}>
                      <SelectTrigger className='uppercase'>
                        <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                      <SelectContent className='uppercase'>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={`${employee.first_name} ${employee.last_name}`}>
                            {`${employee.first_name} ${employee.last_name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.employee && <span className="text-red-500 text-sm">{errors.employee}</span>}
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className="grid items-center gap-1.5">
                      <Label htmlFor="dateFrom" className='text-base'>Date From</Label>
                      <Input type="date" id="dateFrom" value={dateFrom} onChange={(e) => {
                        setDateFrom(e.target.value);
                        setErrors(prevErrors => ({ ...prevErrors, dateFrom: '' }));
                      }} />
                      {errors.dateFrom && <span className="text-red-500 text-sm">{errors.dateFrom}</span>}
                    </div>
                    <div className="grid items-center gap-1.5">
                      <Label htmlFor="dateTo" className='text-base'>Date To</Label>
                      <Input type="date" id="dateTo" value={dateTo} onChange={(e) => {
                        setDateTo(e.target.value);
                        setErrors(prevErrors => ({ ...prevErrors, dateTo: '' }));
                      }} />
                      {errors.dateTo && <span className="text-red-500 text-sm">{errors.dateTo}</span>}
                    </div>
                  </div>

                  <div className="grid items-center gap-1.5">
                    <Label htmlFor="minWage" className='text-base'>Rate</Label>
                    <Input type="text" id="minWage" value={selectedRate.toFixed(2)} disabled />
                  </div>

                  <div className="grid items-center gap-1.5">
                    <Label htmlFor="totalSalary" className='text-base'>Total Salary</Label>
                    <Input type="text" id="totalSalary" readOnly value={totalSalary} />
                  </div>

                  <button
                    className="mt-4 p-2 bg-primary text-white rounded hover:bg-primary-dark"
                    onClick={handleSubmit}
                    disabled={loading} // Disable button when loading
                  >
                    {loading ? 'Submitting...' : 'Submit'} {/* Show loading text */}
                  </button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default DialogAttendance;