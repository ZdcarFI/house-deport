import React, { useState } from 'react'
import { Input } from "@nextui-org/react"

interface DateRangePickerProps {
  onChange: (range: { start: Date; end: Date }) => void
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)

    // If end date exists and is valid, use it. Otherwise, use current date
    const effectiveEndDate = endDate
      ? new Date(endDate)
      : new Date()

    onChange({
      start: new Date(newStartDate),
      end: effectiveEndDate
    })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)

    // If start date exists and is valid, use it. Otherwise, use one month ago
    const effectiveStartDate = startDate
      ? new Date(startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 1))

    onChange({
      start: effectiveStartDate,
      end: new Date(newEndDate)
    })
  }

  return (
    <div className="flex gap-4 mb-8">
      <Input
        type="date"
        label="Fecha de inicio"
        value={startDate}
        onChange={handleStartDateChange}
        className="bg-background dark:bg-background text-foreground dark:text-foreground"
      />
      <Input
        type="date"
        label="Fecha de fin"
        value={endDate}
        onChange={handleEndDateChange}
        className="bg-background dark:bg-background text-foreground dark:text-foreground"
      />
    </div>
  )
}