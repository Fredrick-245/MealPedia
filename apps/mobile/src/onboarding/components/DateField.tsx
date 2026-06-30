import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { colors, fontSize, radius, spacing } from '../../theme';

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDate(date: Date): string {
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}

function parseDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const month = Number(match[1]) - 1;
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function CalendarIcon() {
  return (
    <View style={styles.calendar}>
      <View style={styles.calendarBindings}>
        <View style={styles.binding} />
        <View style={styles.binding} />
      </View>
      <View style={styles.calendarBody} />
    </View>
  );
}

export function DateField({ label, value, onChange, error }: DateFieldProps) {
  const [show, setShow] = useState(false);

  const today = new Date();
  const parsed = parseDate(value);
  const fallback = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const [tempDate, setTempDate] = useState<Date>(parsed ?? fallback);

  function open() {
    setTempDate(parsed ?? fallback);
    setShow(true);
  }

  function handleAndroidChange(event: DateTimePickerEvent, date?: Date) {
    setShow(false);
    if (event.type === 'set' && date) {
      onChange(formatDate(date));
    }
  }

  function confirmIos() {
    onChange(formatDate(tempDate));
    setShow(false);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.row, error ? styles.rowError : null]}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value || 'MM/DD/YYYY'}
        </Text>
        <CalendarIcon />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {show && Platform.OS === 'android' ? (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          maximumDate={today}
          onChange={handleAndroidChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={show} transparent animationType="slide">
          <Pressable style={styles.backdrop} onPress={() => setShow(false)}>
            <Pressable style={styles.sheet} onPress={() => undefined}>
              <View style={styles.sheetHeader}>
                <Pressable onPress={() => setShow(false)} hitSlop={8}>
                  <Text style={styles.cancel}>Cancel</Text>
                </Pressable>
                <Text style={styles.sheetTitle}>{label}</Text>
                <Pressable onPress={confirmIos} hitSlop={8}>
                  <Text style={styles.done}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                maximumDate={today}
                onChange={(_event, date) => {
                  if (date) setTempDate(date);
                }}
                style={styles.iosPicker}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rowError: {
    borderBottomColor: colors.primary,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  placeholder: {
    fontSize: fontSize.md,
    color: colors.textSubtle,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: fontSize.xs,
    color: colors.primary,
  },
  calendar: {
    width: 22,
    height: 22,
    alignItems: 'center',
  },
  calendarBindings: {
    flexDirection: 'row',
    width: 16,
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  binding: {
    width: 2,
    height: 5,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  calendarBody: {
    width: 18,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  cancel: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  done: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
  iosPicker: {
    alignSelf: 'center',
  },
});
