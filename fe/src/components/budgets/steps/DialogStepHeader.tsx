import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StepHeaderProps {
  step: number;
  subTitle: string;
  title: React.ReactNode;
  description: string;
}

const DialogStepHeader = ({
  step,
  subTitle,
  title,
  description,
}: StepHeaderProps) => {
  return (
    <DialogHeader className="text-left break-keep">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-brand-subtle text-brand rounded px-2 py-0.5 text-xs font-bold uppercase md:text-sm">
            Step {step}
          </span>
          <span className="text-brand text-sm font-bold uppercase md:text-base">
            {subTitle}
          </span>
        </div>

        <DialogTitle className="pt-1 text-base leading-tight font-bold break-keep md:text-lg">
          {title}
        </DialogTitle>
      </div>

      <DialogDescription className="text-xs md:text-sm">
        {description}
      </DialogDescription>
    </DialogHeader>
  );
};

export default DialogStepHeader;
