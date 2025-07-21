"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

const PersonalTrainerWebsitePage = () => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="container mx-auto py-10">
      <section className="text-center mb-12">
        <Badge className="bg-green-500 border-none text-white">Stand out. Book clients.</Badge>
        <h1 className="text-4xl font-bold mt-4">Get Your Professional Trainer Website in 10 Minutes</h1>
        <p className="text-gray-500 mt-2">Launch your online presence and attract more clients.</p>
        <Button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started Now
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Increase visibility</CardTitle>
            <CardDescription>Attract more clients with a professional online presence.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>A well-designed website helps you stand out from the competition and reach a wider audience.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ready in 5 minutes</CardTitle>
            <CardDescription>Quickly launch your website and start attracting clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Our easy-to-use platform allows you to create a stunning website in just a few minutes.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional design</CardTitle>
            <CardDescription>Impress potential clients with a sleek and modern website.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>We offer a range of professionally designed templates to suit your brand and style.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Do I need any technical skills?</AccordionTrigger>
            <AccordionContent>
              No, our platform is designed to be user-friendly and requires no technical skills.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I customize the design of my website?</AccordionTrigger>
            <AccordionContent>
              Yes, you can easily customize the design of your website to match your brand.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer a free trial so you can try our platform before committing to a subscription.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-500 mb-6">Create your professional trainer website today!</p>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up Now</Button>
      </section>
    </div>
  )
}

export default PersonalTrainerWebsitePage
