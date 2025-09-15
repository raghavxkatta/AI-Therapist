import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, TreePine, Heart, BarChart3 } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Wind className="h-4 w-4 mr-2" />
          Breathing Exercise
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <TreePine className="h-4 w-4 mr-2" />
          Forest Walk
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Heart className="h-4 w-4 mr-2" />
          Zen Garden
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Progress
        </Button>
      </CardContent>
    </Card>
  )
}
