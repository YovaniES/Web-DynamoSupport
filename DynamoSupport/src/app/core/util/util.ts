
export function removeDuplicateObjects(array: any[], property: string) {
  const uniqueIds: any[] = [];

  const unique = array.filter(element => {
    const isDuplicate = uniqueIds.includes(element[property]);

    if (!isDuplicate) {
      uniqueIds.push(element[property]);
      return true;
    }
    return false;
  });
  return unique;
}
