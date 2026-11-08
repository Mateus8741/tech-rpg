# apps/web/components/motion/Stagger.tsx

- StaggerProps · interface · L5-L12 — interface StaggerProps extends Omit<React.ComponentProps<'div'>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
- Stagger · function · L20-L34 — function Stagger({ gap = 0.06, delay = 0, inView = false, children, ...rest }: StaggerProps)
- StaggerItemProps · type · L36-L36 — type StaggerItemProps = Omit<React.ComponentProps<'div'>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>;
- StaggerItem · function · L38-L44 — function StaggerItem({ children, ...rest }: StaggerItemProps)
