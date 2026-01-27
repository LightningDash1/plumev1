import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileSheet = ({ open, onOpenChange }: EditProfileSheetProps) => {
  const { user, updateProfile } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '16');
  const [allowance, setAllowance] = useState(user?.monthlyAllowance?.toString() || '5000');
  const [parentEmail, setParentEmail] = useState(user?.parentEmail || '');

  const handleSave = () => {
    const ageNum = parseInt(age);
    const allowanceNum = parseInt(allowance);

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (ageNum < 13 || ageNum > 19) {
      toast.error('Age must be between 13-19');
      return;
    }

    if (allowanceNum < 0) {
      toast.error('Allowance cannot be negative');
      return;
    }

    if (parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      toast.error('Please enter a valid email');
      return;
    }

    updateProfile({
      name: name.trim(),
      age: ageNum,
      monthlyAllowance: allowanceNum,
      parentEmail: parentEmail.trim() || undefined,
    });

    toast.success('Profile updated! ✨');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Edit Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              className="h-12 rounded-xl"
              maxLength={50}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={13}
                max={19}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowance">Monthly Budget (₹)</Label>
              <Input
                id="allowance"
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(e.target.value)}
                min={0}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentEmail">Parent Email (optional)</Label>
            <Input
              id="parentEmail"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="For weekly summary reports"
              className="h-12 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              They'll only see a read-only summary, not your details
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12 rounded-xl"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};