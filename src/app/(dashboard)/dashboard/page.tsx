"use client";

import { useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EventFormValues } from "@/modules/events/eventFormSchema";
import { useAuthStore } from "@/store/authStore";
import { useEventStore } from "@/store/eventStore";
import { useIntegrationStore } from "@/store/integrationStore";
import { useUIStore } from "@/store/uiStore";
import { useFilteredEvents } from "@/hooks/useFilteredEvents";
import { SearchBar } from "@/components/events/SearchBar";
import { CalendarList } from "@/components/events/CalendarList";
import { EventFormModal } from "@/components/events/EventFormModal";
import { EventDetailsDrawer } from "@/components/events/EventDetailsDrawer";
import { EmptyState } from "@/components/common/EmptyState";
import { Loader } from "@/components/common/Loader";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { events, isLoading, filters, setFilters, fetchEvents, createEvent, deleteEvent } = useEventStore();
  const providers = useIntegrationStore((state) => state.providers);
  const { isEventModalOpen, openEventModal, closeEventModal, selectedEvent, isDrawerOpen, openDrawer, closeDrawer } =
    useUIStore();

  const filteredEvents = useFilteredEvents();
  const connectedProviders = {
    google: providers.google.connected,
    outlook: providers.outlook.connected,
  };

  const hasConnectedProvider = connectedProviders.google || connectedProviders.outlook;

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchEvents(user.id, user.token).catch(() => {
      toast.error("Failed to fetch events");
    });
  }, [fetchEvents, user]);

  const handleCreateEvent = useCallback(
    async (values: EventFormValues) => {
      if (!user) {
        return;
      }

      try {
        await createEvent(
          {
            ...values,
            userId: user.id,
            date: dayjs(values.date).format("YYYY-MM-DD"),
          },
          user.token,
        );
        toast.success("Event created and synced");
        closeEventModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create event or sync provider");
      }
    },
    [closeEventModal, createEvent, user],
  );

  const handleOpenEventModal = useCallback(() => {
    if (!hasConnectedProvider) {
      toast.error("Connect Google or Outlook in Settings before creating events");
      return;
    }

    openEventModal();
  }, [hasConnectedProvider, openEventModal]);

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      if (!user) {
        return;
      }

      try {
        await deleteEvent(eventId, user.token);
        toast.success("Event deleted");
      } catch {
        toast.error("Delete action failed");
      }
    },
    [deleteEvent, user],
  );

  const content = useMemo(() => {
    if (isLoading && events.length === 0) {
      return <Loader />;
    }

    if (!filteredEvents.length) {
      return <EmptyState />;
    }

    return <CalendarList events={filteredEvents} onView={openDrawer} onDelete={handleDeleteEvent} />;
  }, [events.length, filteredEvents, handleDeleteEvent, isLoading, openDrawer]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Box className="space-y-4">
        <Typography variant="h4" className="!font-black !text-slate-900">
          Calendar Events
        </Typography>
        <Typography variant="body2" className="!text-slate-600">
          Create and manage alerts from Google and Outlook providers.
        </Typography>

        <SearchBar
          search={filters.search}
          date={filters.date}
          onSearchChange={(value) => setFilters({ search: value })}
          onDateChange={(value) => setFilters({ date: value })}
        />

        {content}
      </Box>

      <Fab
        color="primary"
        className="!fixed bottom-8 right-8"
        aria-label="add event"
        onClick={handleOpenEventModal}
      >
        <AddRoundedIcon />
      </Fab>

      <EventFormModal
        open={isEventModalOpen}
        loading={isLoading}
        onClose={closeEventModal}
        onSubmit={handleCreateEvent}
        connectedProviders={connectedProviders}
      />

      <EventDetailsDrawer open={isDrawerOpen} event={selectedEvent} onClose={closeDrawer} />
    </motion.div>
  );
}
