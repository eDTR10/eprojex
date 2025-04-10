
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, ChevronsUpDown, LucidePlusCircle } from 'lucide-react'
import React from 'react'
import { cn } from "@/lib/utils"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const frameworks = [
    {
      value: "Ian Nico Caulin",
      label: "Ian Nico Caulin",
    },
    {
      value: "Ryan Jay Reyes",
      label: "Ryan Jay Reyes",
    },
    {
      value: "Jason Llanes",
      label: "Jason Llanes",
    },
];

const AttendanceMainContainer = () => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")


    return (
        <>
          <div className='relative flex justify-between'>
            <div className='flex items-center gap-2'>
                <p className='text-base'>Select Project:</p>
                <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="dark">Project 1</SelectItem>
                    <SelectItem value="system">Project 2</SelectItem>
                </SelectContent>
                </Select>

            </div>

            <div className='flex items-center gap-2'>
                <p className='text-base'>Search:</p>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? frameworks.find((framework) => framework.value === value)?.label
                        : "Search Employee..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Employee..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No employee found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === framework.value ? "opacity-100" : "opacity-0"
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
          </div>

          <div className='grid grid-cols-3 item-center justify-center gap-4 mt-5'>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="filters">Filters:</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="march">March</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="may">May</SelectItem>
                    <SelectItem value="june">June</SelectItem>
                    <SelectItem value="july">July</SelectItem>
                    <SelectItem value="august">August</SelectItem>
                    <SelectItem value="september">September</SelectItem>
                    <SelectItem value="october">October</SelectItem>
                    <SelectItem value="november">November</SelectItem>
                    <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="date">Date Range:</Label>

              <div className='grid grid-cols-3 gap-2 '>
                <div>
                  <Input type="date"/>
                </div>
                <div>
                  <Input type="date" />
                </div>
                <div>
                  <Button>Filter</Button>
                </div>
              </div>
            </div>
          </div>

        <div className='absolute bottom-5 right-5'>
            <button>
                <LucidePlusCircle className='h-16 w-16 text-primary' />
            </button>
        </div>
        </>
       
    )
}

export default AttendanceMainContainer
