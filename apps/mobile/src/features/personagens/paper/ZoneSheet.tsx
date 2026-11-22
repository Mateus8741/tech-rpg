import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Easing, FadeIn, FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated';

import { Button, Icon, Label, useThemeColor } from '@/components/ui';
import { AnimatedView } from '@/components/motion';
import type { Detail } from './items';

const RM = ReduceMotion.System;

/** Popup (bottom sheet) com a explicação do item/área tocado na ficha de papel. */
export function ZoneSheet({ detail, onClose }: { detail: Detail | null; onClose: () => void }) {
  const gold = useThemeColor('--color-gold-ink');
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={!!detail} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {detail && (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <AnimatedView
            entering={FadeIn.duration(180).reduceMotion(RM)}
            exiting={FadeOut.duration(140).reduceMotion(RM)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <Pressable accessibilityLabel="Fechar explicação" style={{ flex: 1 }} onPress={onClose} />
          </AnimatedView>

          <AnimatedView
            entering={FadeInDown.duration(220).easing(Easing.out(Easing.cubic)).reduceMotion(RM)}
            exiting={FadeOut.duration(120).reduceMotion(RM)}
            className="max-h-[86%] rounded-t-[28px] border border-b-0 border-line-strong bg-surface"
            style={{ paddingBottom: insets.bottom + 12 }}
          >
            <View className="items-center pt-2.5">
              <View className="h-1 w-10 rounded-full bg-line-strong" />
            </View>

            <ScrollView contentContainerClassName="gap-4 px-5 pb-2 pt-4" showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center gap-3">
                <View>
                  <View className="h-12 w-12 items-center justify-center rounded-2xl border border-gold/40 bg-gold/15">
                    <Icon name={detail.icon} size={24} color={gold} />
                  </View>
                </View>
                <View className="flex-1">
                  <Label>{detail.kicker}</Label>
                  <Text className="font-display text-[22px] leading-7 text-gold-ink">{detail.title}</Text>
                </View>
              </View>

              {!!detail.chips?.filter(Boolean).length && (
                <View>
                  <View className="flex-row flex-wrap gap-2">
                    {detail.chips.filter(Boolean).map((chip) => (
                      <View key={chip} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1">
                        <Text className="text-[12px] font-bold text-gold-ink">{chip}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {!!detail.what && (
                <View>
                  <Text className="text-[16px] font-semibold leading-6 text-ink">{detail.what}</Text>
                </View>
              )}

              {detail.sections
                .filter((sec) => sec.lines.filter(Boolean).length > 0)
                .map((sec, si) => (
                  <View key={sec.label}>
                    <View className="gap-2.5 rounded-2xl border border-line bg-surface-2 p-4">
                      <Label>{sec.label}</Label>
                      {sec.lines.filter(Boolean).map((line, i) =>
                        sec.bullets ? (
                          <View key={i} className="flex-row gap-2.5">
                            <View className="mt-2 h-1.5 w-1.5 rounded-full bg-gold" />
                            <Text className="flex-1 text-[15px] leading-[22px] text-ink-body">{line}</Text>
                          </View>
                        ) : (
                          <Text key={i} className="text-[15px] leading-[22px] text-ink-body">
                            {line}
                          </Text>
                        ),
                      )}
                    </View>
                  </View>
                ))}

              {!!detail.mine?.length && (
                <View>
                  <View className="gap-1.5 rounded-2xl border border-gold/40 bg-gold/10 p-4">
                    <Label>No seu personagem</Label>
                    {detail.mine.map((line, i) => (
                      <Text key={i} className="text-[15px] font-semibold leading-[22px] text-ink">
                        {line}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {!!detail.tip && (
                <View>
                  <View className="flex-row gap-3 rounded-2xl border border-line bg-surface-2 p-4">
                    <Icon name="bulb-outline" size={20} color={gold} />
                    <Text className="flex-1 text-[14px] leading-5 text-ink-soft">{detail.tip}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View className="px-5 pt-2">
              <Button title="Entendi" icon="checkmark" onPress={onClose} />
            </View>
          </AnimatedView>
        </View>
      )}
    </Modal>
  );
}
