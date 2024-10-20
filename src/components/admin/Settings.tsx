'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentMethod from "./settings/PaymentMethodSettings"



type SettingsCategory = {
  id: string
  name: string
  component: React.ReactNode
}


export default function SettingsPage() {


  const settingsCategories: SettingsCategory[] = [
    { id: 'payment-methods', name: 'Payment Methods', component: <PaymentMethod /> },
  ]

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="payment-methods" className="space-y-4">
        <TabsList>
          {settingsCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {settingsCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            {category.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}