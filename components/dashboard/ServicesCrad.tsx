// components/MobileServiceCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "@/app/i18n/navigation";
import SocialIcon from "../shared/SocialIcon";


interface MobileServiceCardProps {
  service: any;
  locale: string;
  getServiceName: (s: any) => string;
  getServiceDescription: (s: any) => string;
  getCategoryIcon: (categoryId: number | string) => string | undefined; // number | string qabul qiladi
  t: any;
}


export function MobileServiceCard({
  service,
  locale,
  getServiceName,
  getServiceDescription,
  getCategoryIcon,
  t,
}: MobileServiceCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="p-4 space-y-4">
        {/* Header: ID + Exclusive badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">#{service.id}</span>
          {service.name.toLowerCase().includes("exclusive") && (
            <Badge className="bg-red-500 text-white">Exclusive</Badge>
          )}
        </div>

        {/* Title + Short Description */}
        <div>
                    <div className="flex items-center gap-2">

              <SocialIcon 
              iconName={getCategoryIcon(service.category) || ''} 
              className="h-5 w-5 flex-shrink-0" 
            />
            <span className="font-medium">{getServiceName(service)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {getServiceDescription(service).split("\n")[0]}
          </p>
        </div>

        {/* Price Box (katta va markazda) */}
        <div className="bg-primary/5 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {service.price}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t("serviceDetails.per1000")}
          </div>
        </div>

        {/* Min/Max + Average Time */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-muted-foreground">Min</div>
            <div className="font-semibold">{service.min.toLocaleString()}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-muted-foreground">Max</div>
            <div className="font-semibold">{service.max.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            ~{Math.ceil(service.duration / 3600)} {t("serviceDetails.hours")}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                {t("serviceDetails.showDescription")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>#{service.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* <div className="text-3xl font-bold text-primary text-center">
                  {service.price}
                </div> */}
                {/* <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-muted-foreground">Min</div>
                    <div className="font-bold">{service.min}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Max</div>
                    <div className="font-bold">{service.max}</div>
                  </div>
                </div> */}
                {/* <div className="text-center text-sm text-muted-foreground">
                  <Clock className="inline w-4 h-4 mr-1" />
                  ~{Math.ceil(service.duration / 3600)} soat
                </div> */}
                <div className="prose dark:prose-invert text-sm">
                  <p className="whitespace-pre-line text-muted-foreground">
                    {getServiceDescription(service)}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            className="flex-1"
            onClick={() =>
              router.push({
                pathname: "/dashboard",
                query: {
                  tab: "new-orders",
                  service: service.id,
                  category: service.category,
                },
              })
            }
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {t("serviceDetails.orderNow")}
          </Button>
        </div>
      </div>
    </Card>
  );
}