import { Avatar, AvatarImage } from "../ui/avatar";

import { AvatarFallback } from "@radix-ui/react-avatar";
import { Card } from "@/components/ui/card";

const Header = () => {
  return (
    <Card className="mb-8 glass shadow-glass-lg overflow-hidden border-0 max-sm:rounded-t-none max-sm:rounded-b-[25%] relative">
      <div className="bg-linear-to-br from-oyadrop-light to-oyadrop px-6 py-8 text-white">
        <div className="flex flex-col items-center">
          <div className="w-32 mb-4 opacity-90">
            <img
              src="https://oyadrop.com.ng/wp-content/uploads/2020/10/cropped-oa2-1.png"
              alt="OyaDrop Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">
            OyaDrop Request Form
          </h1>
          <p className="text-oyadrop-foreground/90 text-sm max-w-lg text-center">
            Fast and reliable delivery service. Fill the form below to place
            your request.
          </p>
        </div>
        <div className="absolute top-2 right-2 md:top-4 md:right-4">
          <Avatar className="bg-white text-primary flex items-center justify-center">
            <AvatarImage src="" />
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Card>
  );
};

export default Header;
