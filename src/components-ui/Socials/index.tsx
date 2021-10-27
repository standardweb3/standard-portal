import React from 'react';
import { classNames } from '../../functions';
// import Image from '../Image';
import twitter from '../../../public/img/socials/twitter.svg';
import telegram from '../../../public/img/socials/telegram.svg';
import medium from '../../../public/img/socials/medium.svg';
import discord from '../../../public/img/socials/discord.svg';
import website from '../../../public/img/socials/website.svg';
import { ExternalLink } from '../ExternalLink';

export function Socials() {
  const SOCIALS = [
    { alt: 'twitter', src: twitter, url: 'https://twitter.com/standarddefi' },
    { alt: 'medium', src: medium, url: 'https://blog.standard.tech' },
    {
      alt: 'discord',
      src: discord,
      url: 'https://discord.com/invite/p4w9KUZvxe',
    },
    { alt: 'telegram', src: telegram, url: 'http://t.me/standard_protocol' },
    { alt: 'website', src: website, url: 'https://standard.tech' },
  ];

  return (
    <div className="grid grid-cols-5 justify-center items-center">
      {SOCIALS.map((social) => {
        return (
          <div className="col-span-1 text-grey flex items-center justify-center">
            <ExternalLink href={social.url} className="!text-grey">
              {React.createElement(social.src, {
                className: classNames(
                  'stroke-current fill-current',
                  // route.name !== 'Dividend' && 'stroke-1',
                ),
              })}
            </ExternalLink>
          </div>
        );
      })}
    </div>
  );
}
