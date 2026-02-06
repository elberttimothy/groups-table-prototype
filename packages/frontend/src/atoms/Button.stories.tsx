import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from '@storybook/test';
import { Download, Heart, Settings, Trash, User } from 'lucide-react';
import type { FC, PropsWithChildren } from 'react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

export const Default: StoryObj = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    loading: false,
    disabled: false,
    disableRipple: false,
    'aria-label': 'button',
    id: 'button',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    disableRipple: {
      control: 'boolean',
    },
  },
  play: async ({ canvasElement }) => {
    const story = within(canvasElement);
    const buttonElement = story.getByTestId('button');
    expect(buttonElement).toBeVisible();
    expect(buttonElement).toHaveTextContent('Button');
  },
};

const GridContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid gap-4 items-center min-w-[800px] grid-cols-[1.5fr_3fr_3fr_3fr_3fr]">
      {children}
    </div>
  );
};

const ButtonSizeRangeContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex gap-2 justify-center items-baseline">{children}</div>;
};

const ButtonVariantStory = () => {
  return (
    <div className="overflow-x-auto border rounded-md bg-background">
      <div className="flex flex-col gap-6 min-w-max p-6">
        <GridContainer>
          <div></div>
          <p className="font-bold text-center text-foreground">Default</p>
          <p className="font-bold text-center text-foreground">Hover</p>
          <p className="font-bold text-center text-foreground">Disabled</p>
          <p className="font-bold text-center text-foreground">Loading</p>
        </GridContainer>
        <GridContainer>
          <p className="font-bold text-foreground">Default</p>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="default default lg"
              id="default-default-lg"
              variant="default"
              size="lg"
            >
              Button
            </Button>
            <Button
              aria-label="default default default"
              id="default-default-default"
              variant="default"
              size="default"
            >
              Button
            </Button>
            <Button
              aria-label="default default sm"
              id="default-default-sm"
              variant="default"
              size="sm"
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button aria-label="default hover lg" id="default-hover-lg" variant="default" size="lg">
              Button
            </Button>
            <Button
              aria-label="default hover default"
              id="default-hover-default"
              variant="default"
              size="default"
            >
              Button
            </Button>
            <Button aria-label="default hover sm" id="default-hover-sm" variant="default" size="sm">
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="default disabled lg"
              id="default-disabled-lg"
              variant="default"
              size="lg"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="default disabled default"
              id="default-disabled-default"
              variant="default"
              size="default"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="default disabled sm"
              id="default-disabled-sm"
              variant="default"
              size="sm"
              disabled
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="default loading lg"
              id="default-loading-lg"
              variant="default"
              size="lg"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="default loading default"
              id="default-loading-default"
              variant="default"
              size="default"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="default loading sm"
              id="default-loading-sm"
              variant="default"
              size="sm"
              loading
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
        </GridContainer>
        <GridContainer>
          <p className="font-bold text-foreground">Secondary</p>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="secondary default lg"
              id="secondary-default-lg"
              variant="secondary"
              size="lg"
            >
              Button
            </Button>
            <Button
              aria-label="secondary default default"
              id="secondary-default-default"
              variant="secondary"
              size="default"
            >
              Button
            </Button>
            <Button
              aria-label="secondary default sm"
              id="secondary-default-sm"
              variant="secondary"
              size="sm"
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="secondary hover lg"
              id="secondary-hover-lg"
              variant="secondary"
              size="lg"
            >
              Button
            </Button>
            <Button
              aria-label="secondary hover default"
              id="secondary-hover-default"
              variant="secondary"
              size="default"
            >
              Button
            </Button>
            <Button
              aria-label="secondary hover sm"
              id="secondary-hover-sm"
              variant="secondary"
              size="sm"
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="secondary disabled lg"
              id="secondary-disabled-lg"
              variant="secondary"
              size="lg"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="secondary disabled default"
              id="secondary-disabled-default"
              variant="secondary"
              size="default"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="secondary disabled sm"
              id="secondary-disabled-sm"
              variant="secondary"
              size="sm"
              disabled
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="secondary loading lg"
              id="secondary-loading-lg"
              variant="secondary"
              size="lg"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="secondary loading default"
              id="secondary-loading-default"
              variant="secondary"
              size="default"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="secondary loading sm"
              id="secondary-loading-sm"
              variant="secondary"
              size="sm"
              loading
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
        </GridContainer>

        <GridContainer>
          <p className="font-bold text-foreground">Outline</p>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="outline default lg"
              id="outline-default-lg"
              variant="outline"
              size="lg"
            >
              Button
            </Button>
            <Button
              aria-label="outline default default"
              id="outline-default-default"
              variant="outline"
              size="default"
            >
              Button
            </Button>
            <Button
              aria-label="outline default sm"
              id="outline-default-sm"
              variant="outline"
              size="sm"
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button aria-label="outline hover lg" id="outline-hover-lg" variant="outline" size="lg">
              Button
            </Button>
            <Button
              aria-label="outline hover default"
              id="outline-hover-default"
              variant="outline"
              size="default"
            >
              Button
            </Button>
            <Button aria-label="outline hover sm" id="outline-hover-sm" variant="outline" size="sm">
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="outline disabled lg"
              id="outline-disabled-lg"
              variant="outline"
              size="lg"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="outline disabled default"
              id="outline-disabled-default"
              variant="outline"
              size="default"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="outline disabled sm"
              id="outline-disabled-sm"
              variant="outline"
              size="sm"
              disabled
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="outline loading lg"
              id="outline-loading-lg"
              variant="outline"
              size="lg"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="outline loading default"
              id="outline-loading-default"
              variant="outline"
              size="default"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="outline loading sm"
              id="outline-loading-sm"
              variant="outline"
              size="sm"
              loading
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
        </GridContainer>

        <GridContainer>
          <p className="font-bold text-foreground">Ghost</p>
          <ButtonSizeRangeContainer>
            <Button aria-label="ghost default lg" id="ghost-default-lg" variant="ghost" size="lg">
              Button
            </Button>
            <Button
              aria-label="ghost default default"
              id="ghost-default-default"
              variant="ghost"
              size="default"
            >
              Button
            </Button>
            <Button aria-label="ghost default sm" id="ghost-default-sm" variant="ghost" size="sm">
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button aria-label="ghost hover lg" id="ghost-hover-lg" variant="ghost" size="lg">
              Button
            </Button>
            <Button
              aria-label="ghost hover default"
              id="ghost-hover-default"
              variant="ghost"
              size="default"
            >
              Button
            </Button>
            <Button aria-label="ghost hover sm" id="ghost-hover-sm" variant="ghost" size="sm">
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="ghost disabled lg"
              id="ghost-disabled-lg"
              variant="ghost"
              size="lg"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="ghost disabled default"
              id="ghost-disabled-default"
              variant="ghost"
              size="default"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="ghost disabled sm"
              id="ghost-disabled-sm"
              variant="ghost"
              size="sm"
              disabled
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="ghost loading lg"
              id="ghost-loading-lg"
              variant="ghost"
              size="lg"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="ghost loading default"
              id="ghost-loading-default"
              variant="ghost"
              size="default"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="ghost loading sm"
              id="ghost-loading-sm"
              variant="ghost"
              size="sm"
              loading
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
        </GridContainer>

        <GridContainer>
          <p className="font-bold text-foreground">Link</p>
          <ButtonSizeRangeContainer>
            <Button aria-label="link default lg" id="link-default-lg" variant="link" size="lg">
              Button
            </Button>
            <Button
              aria-label="link default default"
              id="link-default-default"
              variant="link"
              size="default"
            >
              Button
            </Button>
            <Button aria-label="link default sm" id="link-default-sm" variant="link" size="sm">
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button aria-label="link hover lg" id="link-hover-lg" variant="link" size="lg">
              Button
            </Button>
            <Button
              aria-label="link hover default"
              id="link-hover-default"
              variant="link"
              size="default"
            >
              Button
            </Button>
            <Button aria-label="link hover sm" id="link-hover-sm" variant="link" size="sm">
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="link disabled lg"
              id="link-disabled-lg"
              variant="link"
              size="lg"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="link disabled default"
              id="link-disabled-default"
              variant="link"
              size="default"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="link disabled sm"
              id="link-disabled-sm"
              variant="link"
              size="sm"
              disabled
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="link loading lg"
              id="link-loading-lg"
              variant="link"
              size="lg"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="link loading default"
              id="link-loading-default"
              variant="link"
              size="default"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="link loading sm"
              id="link-loading-sm"
              variant="link"
              size="sm"
              loading
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
        </GridContainer>

        <GridContainer>
          <p className="font-bold text-foreground">Destructive</p>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="destructive default lg"
              id="destructive-default-lg"
              variant="destructive"
              size="lg"
            >
              Button
            </Button>
            <Button
              aria-label="destructive default default"
              id="destructive-default-default"
              variant="destructive"
              size="default"
            >
              Button
            </Button>
            <Button
              aria-label="destructive default sm"
              id="destructive-default-sm"
              variant="destructive"
              size="sm"
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="destructive hover lg"
              id="destructive-hover-lg"
              variant="destructive"
              size="lg"
            >
              Button
            </Button>
            <Button
              aria-label="destructive hover default"
              id="destructive-hover-default"
              variant="destructive"
              size="default"
            >
              Button
            </Button>
            <Button
              aria-label="destructive hover sm"
              id="destructive-hover-sm"
              variant="destructive"
              size="sm"
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="destructive disabled lg"
              id="destructive-disabled-lg"
              variant="destructive"
              size="lg"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="destructive disabled default"
              id="destructive-disabled-default"
              variant="destructive"
              size="default"
              disabled
            >
              Button
            </Button>
            <Button
              aria-label="destructive disabled sm"
              id="destructive-disabled-sm"
              variant="destructive"
              size="sm"
              disabled
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
          <ButtonSizeRangeContainer>
            <Button
              aria-label="destructive loading lg"
              id="destructive-loading-lg"
              variant="destructive"
              size="lg"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="destructive loading default"
              id="destructive-loading-default"
              variant="destructive"
              size="default"
              loading
            >
              Button
            </Button>
            <Button
              aria-label="destructive loading sm"
              id="destructive-loading-sm"
              variant="destructive"
              size="sm"
              loading
            >
              Button
            </Button>
          </ButtonSizeRangeContainer>
        </GridContainer>
      </div>
    </div>
  );
};

const IconButtonVariantStory = () => {
  return (
    <div className="overflow-x-auto border rounded-md bg-background">
      <div className="flex flex-col gap-6 min-w-max p-6">
        <div className="grid gap-4 items-center min-w-[600px] grid-cols-[1.5fr_2fr_2fr_2fr_2fr]">
          <div></div>
          <p className="font-bold text-center text-foreground">Default</p>
          <p className="font-bold text-center text-foreground">Hover</p>
          <p className="font-bold text-center text-foreground">Disabled</p>
          <p className="font-bold text-center text-foreground">Loading</p>
        </div>
        <div className="grid gap-4 items-center min-w-[600px] grid-cols-[1.5fr_2fr_2fr_2fr_2fr]">
          <p className="font-bold text-foreground">Default</p>
          <div className="flex justify-center">
            <Button
              aria-label="default icon button with heart icon"
              id="icon-default-default"
              variant="default"
              size="icon"
            >
              <Heart />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="default hover icon button with heart icon"
              id="icon-default-hover"
              variant="default"
              size="icon"
            >
              <Heart />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="default disabled icon button with heart icon"
              id="icon-default-disabled"
              variant="default"
              size="icon"
              disabled
            >
              <Heart />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="default loading icon button with heart icon"
              id="icon-default-loading"
              variant="default"
              size="icon"
              loading
            >
              <Heart />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 items-center min-w-[600px] grid-cols-[1.5fr_2fr_2fr_2fr_2fr]">
          <p className="font-bold text-foreground">Secondary</p>
          <div className="flex justify-center">
            <Button
              aria-label="secondary icon button with settings icon"
              id="icon-secondary-default"
              variant="secondary"
              size="icon"
            >
              <Settings />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="secondary hover icon button with settings icon"
              id="icon-secondary-hover"
              variant="secondary"
              size="icon"
            >
              <Settings />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="secondary disabled icon button with settings icon"
              id="icon-secondary-disabled"
              variant="secondary"
              size="icon"
              disabled
            >
              <Settings />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="secondary loading icon button with settings icon"
              id="icon-secondary-loading"
              variant="secondary"
              size="icon"
              loading
            >
              <Settings />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 items-center min-w-[600px] grid-cols-[1.5fr_2fr_2fr_2fr_2fr]">
          <p className="font-bold text-foreground">Outline</p>
          <div className="flex justify-center">
            <Button
              aria-label="outline icon button with download icon"
              id="icon-outline-default"
              variant="outline"
              size="icon"
            >
              <Download />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="outline hover icon button with download icon"
              id="icon-outline-hover"
              variant="outline"
              size="icon"
            >
              <Download />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="outline disabled icon button with download icon"
              id="icon-outline-disabled"
              variant="outline"
              size="icon"
              disabled
            >
              <Download />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="outline loading icon button with download icon"
              id="icon-outline-loading"
              variant="outline"
              size="icon"
              loading
            >
              <Download />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 items-center min-w-[600px] grid-cols-[1.5fr_2fr_2fr_2fr_2fr]">
          <p className="font-bold text-foreground">Ghost</p>
          <div className="flex justify-center">
            <Button
              aria-label="ghost icon button with user icon"
              id="icon-ghost-default"
              variant="ghost"
              size="icon"
            >
              <User />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="ghost hover icon button with user icon"
              id="icon-ghost-hover"
              variant="ghost"
              size="icon"
            >
              <User />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="ghost disabled icon button with user icon"
              id="icon-ghost-disabled"
              variant="ghost"
              size="icon"
              disabled
            >
              <User />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="ghost loading icon button with user icon"
              id="icon-ghost-loading"
              variant="ghost"
              size="icon"
              loading
            >
              <User />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 items-center min-w-[600px] grid-cols-[1.5fr_2fr_2fr_2fr_2fr]">
          <p className="font-bold text-foreground">Destructive</p>
          <div className="flex justify-center">
            <Button
              aria-label="destructive icon button with trash icon"
              id="icon-destructive-default"
              variant="destructive"
              size="icon"
            >
              <Trash />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="destructive hover icon button with trash icon"
              id="icon-destructive-hover"
              variant="destructive"
              size="icon"
            >
              <Trash />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="destructive disabled icon button with trash icon"
              id="icon-destructive-disabled"
              variant="destructive"
              size="icon"
              disabled
            >
              <Trash />
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              aria-label="destructive loading icon button with trash icon"
              id="icon-destructive-loading"
              variant="destructive"
              size="icon"
              loading
            >
              <Trash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LightModeVariants: StoryObj = {
  render: () => <ButtonVariantStory />,
  parameters: {
    controls: {
      disable: true,
    },
    pseudo: {
      hover: [
        '#default-hover-lg',
        '#default-hover-default',
        '#default-hover-sm',
        '#secondary-hover-lg',
        '#secondary-hover-default',
        '#secondary-hover-sm',
        '#outline-hover-lg',
        '#outline-hover-default',
        '#outline-hover-sm',
        '#ghost-hover-lg',
        '#ghost-hover-default',
        '#ghost-hover-sm',
        '#link-hover-lg',
        '#link-hover-default',
        '#link-hover-sm',
        '#destructive-hover-lg',
        '#destructive-hover-default',
        '#destructive-hover-sm',
      ],
    },
  },
};

export const DarkModeVariants: StoryObj = {
  render: () => <ButtonVariantStory />,
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      disable: true,
    },
    pseudo: {
      hover: [
        '#default-hover-lg',
        '#default-hover-default',
        '#default-hover-sm',
        '#secondary-hover-lg',
        '#secondary-hover-default',
        '#secondary-hover-sm',
        '#outline-hover-lg',
        '#outline-hover-default',
        '#outline-hover-sm',
        '#ghost-hover-lg',
        '#ghost-hover-default',
        '#ghost-hover-sm',
        '#link-hover-lg',
        '#link-hover-default',
        '#link-hover-sm',
        '#destructive-hover-lg',
        '#destructive-hover-default',
        '#destructive-hover-sm',
      ],
    },
  },
};

export const LightModeIconVariants: StoryObj = {
  render: () => <IconButtonVariantStory />,
  parameters: {
    controls: {
      disable: true,
    },
    pseudo: {
      hover: [
        '#icon-default-hover',
        '#icon-secondary-hover',
        '#icon-outline-hover',
        '#icon-ghost-hover',
        '#icon-link-hover',
        '#icon-destructive-hover',
      ],
    },
  },
};

export const DarkModeIconVariants: StoryObj = {
  render: () => <IconButtonVariantStory />,
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      disable: true,
    },
    pseudo: {
      hover: [
        '#icon-default-hover',
        '#icon-secondary-hover',
        '#icon-outline-hover',
        '#icon-ghost-hover',
        '#icon-link-hover',
        '#icon-destructive-hover',
      ],
    },
  },
};
