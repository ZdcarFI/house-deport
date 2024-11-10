import React from 'react'
import { Card, CardBody } from "@nextui-org/react"
import { DollarSign, Package, Users, ShoppingCart } from "lucide-react"

interface DataCardProps {
  status?: "success" | "error"
  title: string
  subText: string
  content: React.ReactNode
  trendText?: string
  icon: "dollar" | "package" | "users" | "shopping-cart"
}

const iconMap = {
  "dollar": DollarSign,
  "package": Package,
  "users": Users,
  "shopping-cart": ShoppingCart
}

export const DataCard: React.FC<DataCardProps> = ({
  status = "success",
  title,
  subText,
  content,
  trendText,
  icon
}) => {
  const IconComponent = iconMap[icon]

  return (
    <Card className="w-full">
      <CardBody className="flex flex-row items-center justify-between">
        <div>
          <p className="text-small text-default-500 uppercase">{title}</p>
          <p className="text-3xl font-bold mt-1">{content}</p>
          <div className="flex items-center mt-2">
            <p className={`text-small font-bold ${status === 'success' ? 'text-success' : 'text-danger'} mr-1`}>
              {trendText}
            </p>
            <p className="text-small text-default-500">{subText}</p>
          </div>
        </div>
        <div className={`p-3 rounded-full ${status === 'success' ? 'bg-success/20' : 'bg-danger/20'}`}>
          <IconComponent className={`h-6 w-6 ${status === 'success' ? 'text-success' : 'text-danger'}`} />
        </div>
      </CardBody>
    </Card>
  )
}