import React, { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getPaymentMethods, handleActiveStatus, upsertPaymentMethod } from '@/actions/payments/methods';
import { CldImage, CldUploadWidget } from 'next-cloudinary';


type PaymentMethod = {
  id: string;
  type: 'UPI' | 'NETBANKING' | 'QR' | 'CASH';
  name: string;
  isActive: boolean;
  upiId?: string;
  beneficiaryName?: string;
  accountNumber?: string;
  bankName?: string;
  ifsc?: string;
  qrcode?: string;
};

const PaymentMethodInput = React.memo(({ id, label, disabled, value, onChange }: { id: string, label: string, disabled: boolean, value: string, onChange: (value: string) => void }) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label}`}
        className="mb-2"
      />
    </>
  );
});

PaymentMethodInput.displayName = 'PaymentMethodInput';

const PaymentMethodDetailsForm = React.memo(({ method, onUpdate }: { method: PaymentMethod, onUpdate: (updatedMethod: PaymentMethod) => void }) => {
  const [formData, setFormData] = useState(method);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const handleSuccess = (result) => {
    handleInputChange('qrcode', result.info.public_id);
  }

  return (
    <div className="mt-4 space-y-4">
      {method.type === 'UPI' && (
        <>
          <PaymentMethodInput id={`${method.id}-upiId`} disabled={!method.isActive} label="UPI ID" value={formData.upiId || ''} onChange={(value) => handleInputChange('upiId', value)} />
          <PaymentMethodInput id={`${method.id}-beneficiaryName`} disabled={!method.isActive} label="Beneficiary Name" value={formData.beneficiaryName || ''} onChange={(value) => handleInputChange('beneficiaryName', value)} />
        </>
      )}
      {method.type === 'QR' && (
        <>
          {method.isActive &&
            <CldUploadWidget options={{ maxFiles: 1 }} onSuccess={handleSuccess} uploadPreset="hostel">
              {({ open }) => {
                return (
                  <Button onClick={() => { open() }} className="w-full bg-gray-100 text-black hover:bg-gray-200 font-bold py-3 rounded-lg transition-all duration-300 transform">
                    Upload QR Code
                  </Button>

                );
              }}
            </CldUploadWidget>
          }
          <CldImage
            src={method.qrcode!}
            alt="Payment Proof"
            width={250}
            height={250}
            className="object-cover rounded-lg cursor-pointer"
          />
        </>

      )}
      {method.type === 'NETBANKING' && (
        <>
          <PaymentMethodInput disabled={!method.isActive} id={`${method.id}-beneficiaryName`} label="Beneficiary Name" value={formData.beneficiaryName || ''} onChange={(value) => handleInputChange('beneficiaryName', value)} />
          <PaymentMethodInput disabled={!method.isActive} id={`${method.id}-accountNumber`} label="Account Number" value={formData.accountNumber || ''} onChange={(value) => handleInputChange('accountNumber', value)} />
          <PaymentMethodInput disabled={!method.isActive} id={`${method.id}-bankName`} label="Bank Name" value={formData.bankName || ''} onChange={(value) => handleInputChange('bankName', value)} />
          <PaymentMethodInput disabled={!method.isActive} id={`${method.id}-ifsc`} label="IFSC Code" value={formData.ifsc || ''} onChange={(value) => handleInputChange('ifsc', value)} />
        </>
      )}
    </div>
  );
});

PaymentMethodDetailsForm.displayName = 'PaymentMethodDetailsForm';

const PaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setIsLoading(true);
      try {
        const response = await getPaymentMethods();
        if (!response.error && response.data) {
          console.log(response.data);

          setPaymentMethods(response.data);
        } else {
          setError(response.msg);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch payment methods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleTogglePaymentMethod = useCallback(async (id: string) => {
    await handleActiveStatus(id);
    setPaymentMethods(prevMethods =>
      prevMethods.map(method =>
        method.id === id ? { ...method, isActive: !method.isActive } : method
      )
    );
  }, []);

  const handleUpdateMethod = useCallback((updatedMethod: PaymentMethod) => {
    setPaymentMethods(prevMethods =>
      prevMethods.map(method =>
        method.id === updatedMethod.id ? { ...method, ...updatedMethod } : method
      )
    );
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      for (const method of paymentMethods) {
        const response = await upsertPaymentMethod(method);
        if (response.error) {
          setError(`Failed to update ${method.name}: ${response.msg}`);
          break;
        }
      }
      if (!error) {

      }
    } catch (err) {
      console.error(err);
      setError('Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Choose the payment methods available for your hostel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map(method => (
          <div key={method.id} className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <Switch
                  id={`switch-${method.id}`}
                  checked={!!method.isActive}
                  onCheckedChange={() => handleTogglePaymentMethod(method.id)}
                />
                <label
                  htmlFor={`switch-${method.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {method.name}
                </label>
              </div>
              {method.isActive ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
            <PaymentMethodDetailsForm method={method} onUpdate={handleUpdateMethod} />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="default" className='ml-auto' onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethod;