import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Pencil, Search } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import axios from "./../../../plugin/axios"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"

interface Employee {
  id: number
  first_name: string
  email: string
  last_name: string
  inital: string
  project: string
  designation: string
  is_active: boolean
  rate: number | null
}

function EmployeeMainContainer() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [newEmployee, setNewEmployee] = useState({
    email: "",
    project: "",
    designation: "",
    inital: "",
    first_name: "",
    last_name: "",
    password: "",
    re_password: "",
    rate: "",
  })

  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(true)

  // Add this state for managing the update dialog
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [employeeToUpdate, setEmployeeToUpdate] = useState<Employee | null>(null)

  const validatePasswords = () => {
    if (newEmployee.password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    if (newEmployee.password !== newEmployee.re_password) {
      setPasswordError("Passwords do not match")
      return false
    }
    setPasswordError("")
    return true
  }

  // Get unique projects for filter
  const uniqueProjects = Array.from(
    new Set(employees.map((emp) => emp.project || "Not Assigned"))
  )

  // Filter employees based on search and project
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.inital} ${employee.last_name}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase())
    const matchesProject = selectedProject === "all" || 
      (employee.project || "Not Assigned") === selectedProject

    return matchesSearch && matchesProject
  })

  function GetUsers(){
    setLoading(true)
    axios.get('users/all',{
      headers: {
          Authorization: `Token 8622fe22a3814cbc47e1ec14555fdc8cb529ee79`,
      }}).then((response) => {
      setEmployees(response.data)
    }).finally(() => {
      setLoading(false)
    })
  }

  function UpdateStatus(id: number, status: boolean) {
    // Show confirmation dialog first
    Swal.fire({
      title: 'Confirm Status Update',
      text: `Are you sure you want to ${status ? 'activate' : 'deactivate'} this employee?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`users/update/${id}/`, {
          is_active: status
        }, {
          headers: {
            Authorization: `Token 8622fe22a3814cbc47e1ec14555fdc8cb529ee79`,
          }
        }).then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Status Updated',
            text: `Employee ${response.data.first_name} ${response.data.last_name} is now ${status ? 'active' : 'inactive'}`,
            showConfirmButton: false,
            timer: 1500
          })
          // Update the employees list to reflect the change
          setEmployees(employees.map(emp => 
            emp.id === id ? { ...emp, is_active: status } : emp
          ))
        }).catch((error) => {
          console.error('Error updating status:', error)
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Failed to update employee status. Please try again.',
            showConfirmButton: false,
            timer: 1500
          })
        })
      }
    })
  }

  // Add this function for updating employee
  function UpdateEmployee(id: number, data: Partial<Employee>) {
    // Show confirmation dialog first
    axios.put(`users/update/${id}/`, data, {
      headers: {
        Authorization: `Token 8622fe22a3814cbc47e1ec14555fdc8cb529ee79`,
      }
    }).then((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Employee Updated',
        text: `${response.data.first_name} ${response.data.last_name}'s information has been updated`,
        showConfirmButton: false,
        timer: 1500
      })
      // Update the employees list to reflect the change
      setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, ...data } : emp
      ))
    }).catch((error) => {
      console.error('Error updating employee:', error)
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update employee information. Please try again.',
        showConfirmButton: false,
        timer: 1500
      })
      // Reopen the dialog on error
      setIsUpdateDialogOpen(true)
    })
  }

  // Fetch employees data - replace with your actual API call
  useEffect(() => {
    // Temporary mock data
    
    GetUsers()
  }, [])

  // Update the handleUpdate function
  const handleUpdate = (id: number) => {
    const employee = employees.find(emp => emp.id === id)
    if (employee) {
      setEmployeeToUpdate(employee)
      setIsUpdateDialogOpen(true)
    }
  }

  const handleActivation = (id: number, newState: boolean) => {
    UpdateStatus(id, newState)
  }

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePasswords()) {
      return
    }
    // Add your API call here
    console.log('New employee:', newEmployee)
    // Reset form
    setNewEmployee({
      email: "",
      project: "",
      designation: "",
      inital: "",
      first_name: "",
      last_name: "",
      password: "",
      re_password: "",
      rate: "",
    })
    setPasswordError("")
  }

  const TableSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-12 w-[200px]" />
          <Skeleton className="h-12 w-[200px]" />
          <Skeleton className="h-12 w-[100px]" />
          <Skeleton className="h-12 w-[50px] ml-auto" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-6 h-full w-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4 pt-4">
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    placeholder="taylor"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({
                      ...newEmployee,
                      first_name: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    placeholder="swift"
                    value={newEmployee.last_name}
                    onChange={(e) => setNewEmployee({
                      ...newEmployee,
                      last_name: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="space-y-2">
                      <Label htmlFor="inital">Initial</Label>
                      <Input
                        id="inital"
                        placeholder="M"
                        value={newEmployee.inital}
                        onChange={(e) => setNewEmployee({
                          ...newEmployee,
                          inital: e.target.value
                        })}
                      />
                    </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="taylor.swift@gmail.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({
                    ...newEmployee,
                    email: e.target.value
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  placeholder="Project Name"
                  value={newEmployee.project}
                  onChange={(e) => setNewEmployee({
                    ...newEmployee,
                    project: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="Site Engineer"
                  value={newEmployee.designation}
                  onChange={(e) => setNewEmployee({
                    ...newEmployee,
                    designation: e.target.value
                  })}
                />
              </div>
              <div className=" grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newEmployee.password}
                    onChange={(e) => {
                      setNewEmployee({
                        ...newEmployee,
                        password: e.target.value
                      })
                      setPasswordError("")
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="re_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="re_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newEmployee.re_password}
                    onChange={(e) => {
                      setNewEmployee({
                        ...newEmployee,
                        re_password: e.target.value
                      })
                      setPasswordError("")
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rate">Rate</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newEmployee.rate}
                  onChange={(e) => setNewEmployee({
                    ...newEmployee,
                    rate: e.target.value
                  })}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <DialogTrigger asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogTrigger>
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedProject}
          onValueChange={setSelectedProject}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <TableSkeleton />
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {`${employee.first_name} ${employee.inital} ${employee.last_name}`}
                  </TableCell>
                  <TableCell>{employee.project || "Not Assigned"}</TableCell>
                  <TableCell>{employee.designation || "Not Assigned"}</TableCell>
                  <TableCell>{employee.rate || "Not Assigned"}</TableCell>
                  <TableCell>
                  <Switch
  checked={employee.is_active}
  onCheckedChange={(checked) => handleActivation(employee.id, checked)}
/>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdate(employee.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Update Employee Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
          </DialogHeader>
          {employeeToUpdate && (
            <form onSubmit={(e) => {
              e.preventDefault()
              if (employeeToUpdate) {
                // First close the dialog
                setIsUpdateDialogOpen(false)
                // Then show confirmation and proceed with update
                Swal.fire({
                  title: 'Confirm Update',
                  text: "Are you sure you want to update this employee's information?",
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, update it!',
                  cancelButtonText: 'No, cancel'
                }).then((result) => {
                  if (result.isConfirmed) {
                    UpdateEmployee(employeeToUpdate.id, {
                      first_name: employeeToUpdate.first_name,
                      last_name: employeeToUpdate.last_name,
                      inital: employeeToUpdate.inital,
                      project: employeeToUpdate.project,
                      designation: employeeToUpdate.designation,
                      email: employeeToUpdate.email,
                      rate: employeeToUpdate.rate,
                    })
                  } else {
                    // If user cancels, reopen the dialog
                    setIsUpdateDialogOpen(true)
                  }
                })
              }
            }} className="space-y-4 pt-4">
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="update_first_name">First Name</Label>
                  <Input
                    id="update_first_name"
                    placeholder="First Name"
                    value={employeeToUpdate.first_name}
                    onChange={(e) => setEmployeeToUpdate({
                      ...employeeToUpdate,
                      first_name: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="update_last_name">Last Name</Label>
                  <Input
                    id="update_last_name"
                    placeholder="Last Name"
                    value={employeeToUpdate.last_name}
                    onChange={(e) => setEmployeeToUpdate({
                      ...employeeToUpdate,
                      last_name: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update_initial">Initial</Label>
                  <Input
                    id="update_initial"
                    placeholder="M"
                    value={employeeToUpdate.inital}
                    onChange={(e) => setEmployeeToUpdate({
                      ...employeeToUpdate,
                      inital: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update_project">Email</Label>
                <Input
                  id="update_project"
                  placeholder="Project Name"
                  value={employeeToUpdate.email}
                  onChange={(e) => setEmployeeToUpdate({
                    ...employeeToUpdate,
                    email: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update_project">Project</Label>
                <Input
                  id="update_project"
                  placeholder="Project Name"
                  value={employeeToUpdate.project}
                  onChange={(e) => setEmployeeToUpdate({
                    ...employeeToUpdate,
                    project: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update_designation">Designation</Label>
                <Input
                  id="update_designation"
                  placeholder="Designation"
                  value={employeeToUpdate.designation}
                  onChange={(e) => setEmployeeToUpdate({
                    ...employeeToUpdate,
                    designation: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update_rate">Rate</Label>
                <Input
                  id="update_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={employeeToUpdate.rate || ""}
                  onChange={(e) => setEmployeeToUpdate({
                    ...employeeToUpdate,
                    rate: parseFloat(e.target.value) || null
                  })}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Employee</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeMainContainer