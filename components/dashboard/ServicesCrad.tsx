// components/MobileServiceCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "@/app/i18n/navigation";
import SocialIcon from "../shared/SocialIcon";
import { Money } from "@/components/provider/currency-provider";

interface ServiceCardItem {
  id: number | string;
  name: string;
  category: number | string;
  price: string | number;
  currency?: string;
  min: number;
  max: number;
  duration: number;
}

type Translator = (key: string) => string;

interface MobileServiceCardProps {
  service: ServiceCardItem;
  getServiceName: (s: ServiceCardItem) => string;
  getServiceDescription: (s: ServiceCardItem) => string;
  getCategoryIcon: (categoryId: number | string) => string | undefined;
  t: Translator;
}

export function MobileServiceCard({
  service,
  getServiceName,
  getServiceDescription,
  getCategoryIcon,
  t,
}: MobileServiceCardProps) {
  const router = useRouter();
  const name = getServiceName(service);
  const description = getServiceDescription(service).trim();
  const shortDescription = description.split("\n")[0]?.trim() || "";
  const showDescription =
    shortDescription.length > 0 &&
    shortDescription.toLowerCase() !== name.toLowerCase();

  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="p-3 space-y-2.5">
        {/* Header: ID + Exclusive badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground">#{service.id}</span>
          {service.name.toLowerCase().includes("exclusive") && (
            <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">Exclusive</Badge>
          )}
        </div>

        {/* Title (once) + optional short description */}
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <SocialIcon
              iconName={getCategoryIcon(service.category) || ""}
              className="h-5 w-5 flex-shrink-0 mt-0.5"
            />
            <h3 className="font-semibold text-sm leading-snug">{name}</h3>
          </div>
          {showDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2 pl-7">
              {shortDescription}
            </p>
          )}
        </div>

        {/* Price + Min/Max in one compact row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1 bg-primary/5 rounded-xl px-2 py-2 text-center">
            <div className="text-base font-bold text-primary leading-tight">
              <Money value={service.price} currency={service.currency} />
            </div>
            <div className="text-[10px] text-muted-foreground">{t("serviceDetails.per1000")}</div>
          </div>
          <div className="bg-muted/50 rounded-xl px-2 py-2 text-center">
            <div className="text-[10px] text-muted-foreground">Min</div>
            <div className="text-xs font-semibold">{service.min.toLocaleString()}</div>
          </div>
          <div className="bg-muted/50 rounded-xl px-2 py-2 text-center">
            <div className="text-[10px] text-muted-foreground">Max</div>
            <div className="text-xs font-semibold">{service.max.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>
            ~{Math.ceil(service.duration / 3600)} {t("serviceDetails.hours")}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                <Eye className="w-3.5 h-3.5 mr-1" />
                {t("serviceDetails.showDescription")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <SocialIcon
                    iconName={getCategoryIcon(service.category) || ""}
                    className="h-5 w-5 flex-shrink-0"
                  />
                  <span className="leading-snug">#{service.id} · {name}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-3">
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {description || name}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            className="flex-1 h-8 text-xs"
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
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
            {t("serviceDetails.orderNow")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
