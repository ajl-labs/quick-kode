import { StyleSheet } from 'react-native';
import { ThemeSpacings } from '../../config/theme';

export default StyleSheet.create({
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
  horizontalSpacing: {
    paddingHorizontal: ThemeSpacings.md,
  },
  verticalSpacing: {
    paddingVertical: ThemeSpacings.md,
  },
  noSpacing: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  flex: { flex: 1 },
  fullWidth: { width: '100%' },
  gap: { gap: ThemeSpacings.md },
});
