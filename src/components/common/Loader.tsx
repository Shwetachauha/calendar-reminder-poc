import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export const Loader = () => {
  return (
    <Box className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Skeleton key={idx} variant="rounded" height={180} className="!rounded-2xl" />
      ))}
    </Box>
  );
};
