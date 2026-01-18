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
    <DialogHeader className="space-y-2 break-keep">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-brand-subtle text-brand rounded px-2 py-0.5 text-sm font-bold uppercase">
            Step {step}
          </span>
          <span className="text-brand font-bold uppercase">{subTitle}</span>
        </div>

        <DialogTitle className="text-xl leading-tight font-bold">
          {title}
        </DialogTitle>
      </div>

      <DialogDescription className="text-sm">{description}</DialogDescription>
    </DialogHeader>
  );
};

export default DialogStepHeader;
