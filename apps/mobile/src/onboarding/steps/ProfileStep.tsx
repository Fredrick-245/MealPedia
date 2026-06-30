import React, { useState } from 'react';
import { StepScreen } from '../components/StepScreen';
import { TextField } from '../components/TextField';
import { SelectField } from '../components/SelectField';
import { DateField } from '../components/DateField';
import { AvatarPicker } from '../components/AvatarPicker';
import { genderOptions, Gender } from '../types';
import { StepProps } from '../StepProps';

const DATE_REGEX = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;

export function ProfileStep({
  step,
  totalSteps,
  data,
  update,
  onBack,
  onNext,
}: StepProps) {
  const { profile } = data;
  const [touched, setTouched] = useState(false);

  function setProfile(patch: Partial<typeof profile>) {
    update({ profile: { ...profile, ...patch } });
  }

  const nameValid = profile.fullName.trim().length > 1;
  const phoneValid = profile.phoneNumber.replace(/\D/g, '').length >= 7;
  const genderValid = profile.gender != null;
  const dobValid = DATE_REGEX.test(profile.dateOfBirth);
  const isValid = nameValid && phoneValid && genderValid && dobValid;

  function handleContinue() {
    setTouched(true);
    if (isValid) onNext();
  }

  return (
    <StepScreen
      step={step}
      totalSteps={totalSteps}
      title="Complete Your Profile 📝"
      subtitle="Don't worry, only you can see your personal data. No one else will be able to see it."
      onBack={onBack}
      onContinue={handleContinue}
    >
      <AvatarPicker
        uri={profile.avatarUri}
        onChange={(uri) => setProfile({ avatarUri: uri })}
      />

      <TextField
        label="Full Name"
        placeholder="Full Name"
        value={profile.fullName}
        onChangeText={(text) => setProfile({ fullName: text })}
        autoCapitalize="words"
        error={touched && !nameValid ? 'Please enter your full name' : undefined}
      />
      <TextField
        label="Phone Number"
        placeholder="+1 000 000 000"
        value={profile.phoneNumber}
        onChangeText={(text) => setProfile({ phoneNumber: text })}
        keyboardType="phone-pad"
        error={touched && !phoneValid ? 'Please enter a valid phone number' : undefined}
      />
      <SelectField<Gender>
        label="Gender"
        placeholder="Gender"
        value={profile.gender}
        options={genderOptions}
        onChange={(gender) => setProfile({ gender })}
        error={touched && !genderValid ? 'Please select your gender' : undefined}
      />
      <DateField
        label="Date of Birth"
        value={profile.dateOfBirth}
        onChange={(dateOfBirth) => setProfile({ dateOfBirth })}
        error={touched && !dobValid ? 'Enter a valid date (MM/DD/YYYY)' : undefined}
      />
    </StepScreen>
  );
}
