import { StyleSheet } from 'react-native';
import { ThemeSpacings } from '../../config/theme';
import { moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
  flex: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  removePadding: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    paddingLeft: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatListContent: {
    gap: ThemeSpacings.md,
    padding: ThemeSpacings.md,
    paddingBottom: ThemeSpacings.lg,
  },
  flatListContentSm: {
    gap: ThemeSpacings.sm,
    paddingBottom: ThemeSpacings.lg,
  },
  spacing: {
    padding: ThemeSpacings.md,
  },
  spacingSm: { padding: ThemeSpacings.sm },
  horizontalSpacing: {
    paddingHorizontal: ThemeSpacings.md,
  },
  horizontalSpacingSm: { paddingHorizontal: ThemeSpacings.sm },

  verticalSpacing: {
    paddingVertical: ThemeSpacings.md,
  },
  verticalSpacingSm: { paddingVertical: ThemeSpacings.sm },
  noSpacing: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  fullWidth: { width: '100%' },
  gap: { gap: ThemeSpacings.md },
  gapSm: { gap: ThemeSpacings.sm },
  noRadius: { borderRadius: 0 },
  code: {
    fontFamily: 'monospace',
    fontStyle: 'italic',
  },
});
