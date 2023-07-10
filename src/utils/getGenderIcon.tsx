import React from 'react';
import {
  IconUser,
  IconGenderMale,
  IconGenderFemale
} from '@tabler/icons-react';
import { type SexType } from 'src/db/queries/commons.lib';

export function getGenderIcon(gender?: SexType | "") {
  if (!Boolean(gender)) return <IconUser size={'1.1rem'} stroke={1.5} />;

  switch (gender) {
    case 'female':
      return <IconGenderFemale size='1.1rem' stroke={1.5} />;
    case 'male':
      return <IconGenderMale size='1.1rem' stroke={1.5} />;
    case 'other':
    default:
      return <IconUser size={'1.1rem'} stroke={1.5} />;
  }
}
