import React from 'react';
import { classNames } from '../../functions';
// import Image from '../Image';
import twitter from '../../../public/img/socials/twitter.svg';
import telegram from '../../../public/img/socials/telegram.svg';
import medium from '../../../public/img/socials/medium.svg';
import discord from '../../../public/img/socials/discord.svg';
// import website from '../../../public/img/socials/website.svg';
import { ExternalLink } from '../ExternalLink';
import Image from '../Image';

export function Socials() {
  const SOCIALS = [
    {
      alt: 'twitter',
      src: '/img/socials/twitter.svg',
      url: 'https://twitter.com/standardweb3',
    },
    {
      alt: 'medium',
      src: '/img/socials/medium.svg',
      url: 'https://blog.standard.tech',
    },
    {
      alt: 'discord',
      src: '/img/socials/discord.svg',
      url: 'https://discord.com/invite/p4w9KUZvxe',
    },
    {
      alt: 'telegram',
      src: '/img/socials/telegram.svg',
      url: 'http://t.me/standard_protocol',
    },
    // { alt: 'website', src: website, url: 'https://standard.tech' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 justify-center items-center">
      {SOCIALS.map((social) => {
        console.log(social);
        return (
          <div className="col-span-1 text-grey flex items-center justify-center">
            <ExternalLink href={social.url} className="!text-grey">
              {/* {React.createElement(social.src, {
                className: classNames(
                  'stroke-current fill-current',
                  // route.name !== 'Dividend' && 'stroke-1',
                ),
              })} */}
              <Image
                src={social.src}
                width="25px"
                height="25px"
                layout="fixed"
              />
            </ExternalLink>
          </div>
        );
      })}
    </div>
  );
}
