import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSoilTesterStore } from '../../store/soil-tester-store';
import { X } from 'lucide-react';

const soilTesterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
});

type SoilTesterFormData = z.infer<typeof soilTesterSchema>;

interface CreateSoilTesterProps {
  onClose: () => void;
}

const CreateSoilTester: React.FC<CreateSoilTesterProps> = ({ onClose }) => {
  const addSoilTester = useSoilTesterStore((state) => state.addSoilTester);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SoilTesterFormData>({
    resolver: zodResolver(soilTesterSchema),
  });

  const onSubmit = (data: SoilTesterFormData) => {
    addSoilTester({
      ...data,
      status: 'active',
      lastReading: {
        ph: 7.0,
        moisture: 60,
        temperature: 25,
        timestamp: new Date().toISOString(),
      },
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Device Name
        </label>
        <input
          {...register('name')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          {...register('location')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Soil Tester
        </button>
      </div>
    </form>
  );
};

export default CreateSoilTester;